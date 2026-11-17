<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\AssessmentBlueprint;
use App\Models\CertificateAttempt;
use App\Models\CertificationAttempt;
use App\Models\CertificationAttemptItem;
use App\Models\CourseAcknowledgement;
use App\Models\Student;
use App\Models\Training;
use App\Models\TrainingQuestion;
use App\Services\AiksService;
use App\Services\LearnerProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Blueprint-driven certification assessment drawn from a course's mapped MCQ bank.
 * Questions are selected per topic (module) within the blueprint's min/max,
 * retries prefer questions the learner did not see last time, and answers and
 * explanations are revealed only after completion. A pass issues a certificate
 * through the existing certificate_attempts table, so it appears in /api/certificate.
 */
class CertificationController extends Controller
{
    public function __construct(protected LearnerProgressService $progress, protected AiksService $aiks)
    {
    }

    /** GET /api/courses/{slug}/assessment/blueprint */
    public function blueprint(string $slug, Request $request): JsonResponse
    {
        [$training, $blueprint] = $this->resolve($slug);
        if (!$blueprint) {
            return response()->json(['success' => false, 'message' => 'No certification assessment for this course.'], 404);
        }

        $pool = $this->pool($training);
        $student = $request->user('student');

        return response()->json(['success' => true, 'data' => [
            'course' => ['id' => $training->id, 'name' => $training->name, 'slug' => $training->slug],
            'total_questions' => min($blueprint->total_questions, $this->plannedTotal($blueprint, $pool)),
            'blueprint_total_questions' => $blueprint->total_questions,
            'pass_mark' => $blueprint->pass_mark,
            'topics' => collect($blueprint->topics)->map(fn ($t) => $t + ['pool_size' => $pool->get($t['module_index'], collect())->count()])->values(),
            'rules' => [
                'Questions are selected per topic to keep topic balance.',
                'Repeat attempts draw a different question mix where the pool allows.',
                'Correct answers and explanations are shown after you complete the attempt.',
            ],
            'requires_acknowledgement' => true,
            'eligibility' => $student instanceof Student ? $this->eligibility($student, $training) : null,
        ]]);
    }

    /** POST /api/courses/{slug}/certification/attempts — Start (or resume) an attempt. */
    public function start(string $slug, Request $request): JsonResponse
    {
        [$training, $blueprint] = $this->resolve($slug);
        if (!$blueprint) {
            return response()->json(['success' => false, 'message' => 'No certification assessment for this course.'], 404);
        }

        /** @var Student $student */
        $student = $request->user();
        $eligibility = $this->eligibility($student, $training);
        if (!$eligibility['acknowledged']) {
            return response()->json([
                'success' => false,
                'code' => 'acknowledgement_required',
                'message' => 'Acknowledge the training boundary before starting the assessment.',
                'acknowledge_url' => "/api/courses/{$training->slug}/acknowledge",
            ], 403);
        }

        $open = CertificationAttempt::where('student_id', $student->id)->where('training_id', $training->id)->where('status', 'in_progress')->first();
        if ($open) {
            return response()->json(['success' => true, 'resumed' => true, 'data' => $this->presentAttempt($open)], 200);
        }

        $questions = $this->selectQuestions($student, $training, $blueprint);
        if ($questions->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'The question pool for this course is empty.'], 422);
        }

        $attempt = DB::transaction(function () use ($student, $training, $questions) {
            $attempt = CertificationAttempt::create([
                'student_id' => $student->id,
                'training_id' => $training->id,
                'status' => 'in_progress',
                'total_questions' => $questions->count(),
                'started_at' => now(),
            ]);

            foreach ($questions->values() as $i => $q) {
                $letters = array_slice(['A', 'B', 'C', 'D', 'E', 'F'], 0, count($q->options));
                $shuffled = $letters;
                shuffle($shuffled);
                CertificationAttemptItem::create([
                    'certification_attempt_id' => $attempt->id,
                    'training_question_id' => $q->id,
                    'sort_order' => $i + 1,
                    'options_mapping' => array_combine($letters, $shuffled), // displayed => original
                ]);
            }

            return $attempt;
        });

        return response()->json(['success' => true, 'resumed' => false, 'data' => $this->presentAttempt($attempt)], 201);
    }

    /** GET /api/certification/attempts?course= — Attempt history. */
    public function index(Request $request): JsonResponse
    {
        $course = $request->query('course');
        $attempts = CertificationAttempt::where('student_id', $request->user()->id)
            ->when($course, fn ($q) => $q->whereHas('training', fn ($t) => $t->where('slug', $course)))
            ->with('training:id,name,slug')
            ->latest('started_at')
            ->get()
            ->map(fn (CertificationAttempt $a) => $this->summary($a));

        return response()->json(['success' => true, 'count' => $attempts->count(), 'data' => $attempts]);
    }

    /** GET /api/certification/attempts/{id} — Resume (in progress) or full results (completed). */
    public function show(int $id, Request $request): JsonResponse
    {
        $attempt = CertificationAttempt::where('student_id', $request->user()->id)->findOrFail($id);

        return response()->json(['success' => true, 'data' => $attempt->status === 'completed' ? $this->results($attempt) : $this->presentAttempt($attempt)]);
    }

    /**
     * POST /api/certification/attempts/{id}/answers — Save answers: {"answers": {"<question_id>": "B", ...}}.
     * Letters refer to the displayed (shuffled) options. Can be called repeatedly.
     */
    public function answer(int $id, Request $request): JsonResponse
    {
        $attempt = CertificationAttempt::where('student_id', $request->user()->id)->findOrFail($id);
        if ($attempt->status === 'completed') {
            return response()->json(['success' => false, 'message' => 'This attempt is already completed.'], 409);
        }

        $validated = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*' => 'nullable|string|in:A,B,C,D,E,F,a,b,c,d,e,f',
        ]);

        $items = $attempt->items()->get()->keyBy('training_question_id');
        $unknown = [];
        foreach ($validated['answers'] as $questionId => $letter) {
            $item = $items->get((int) $questionId);
            if (!$item) {
                $unknown[] = $questionId;
                continue;
            }
            $letter = $letter === null ? null : strtoupper($letter);
            if ($letter !== null && !array_key_exists($letter, $item->options_mapping)) {
                $unknown[] = $questionId;
                continue;
            }
            $item->update(['selected_option' => $letter]);
        }

        $answered = $attempt->items()->whereNotNull('selected_option')->count();

        return response()->json(['success' => true, 'data' => [
            'attempt_id' => $attempt->id,
            'answered_count' => $answered,
            'total_questions' => $attempt->total_questions,
            'ignored_question_ids' => $unknown,
        ]]);
    }

    /** POST /api/certification/attempts/{id}/complete — Grade, issue certificate on pass. Idempotent. */
    public function complete(int $id, Request $request): JsonResponse
    {
        /** @var Student $student */
        $student = $request->user();
        $attempt = CertificationAttempt::where('student_id', $student->id)->findOrFail($id);
        $alreadyCompleted = $attempt->status === 'completed';

        if (!$alreadyCompleted) {
            DB::transaction(function () use ($attempt, $student) {
                $attempt = CertificationAttempt::lockForUpdate()->find($attempt->id);
                if ($attempt->status === 'completed') {
                    return;
                }

                $blueprint = AssessmentBlueprint::where('training_id', $attempt->training_id)->first();
                $items = $attempt->items()->with('question.module')->get();
                $topics = [];
                $correct = 0;

                foreach ($items as $item) {
                    $original = $item->selected_option ? ($item->options_mapping[$item->selected_option] ?? null) : null;
                    $isCorrect = $original !== null && strtoupper($original) === strtoupper((string) $item->question->correct_answer);
                    $item->update(['is_correct' => $isCorrect]);
                    $correct += $isCorrect ? 1 : 0;

                    $index = $item->question->module->module_index;
                    $topics[$index] ??= ['module_index' => $index, 'topic' => $this->topicName($blueprint, $index), 'correct' => 0, 'total' => 0];
                    $topics[$index]['total']++;
                    $topics[$index]['correct'] += $isCorrect ? 1 : 0;
                }

                $score = (int) round($correct * 100 / max(1, $items->count()));
                $passed = $score >= ($blueprint?->pass_mark ?? 70);

                $certificate = null;
                if ($passed) {
                    $certificate = CertificateAttempt::create([
                        'student_id' => $student->id,
                        'training_id' => $attempt->training_id,
                        'score' => $score,
                        'passed' => true,
                        'is_completed' => true,
                        'completed_at' => now(),
                    ]);
                }

                ksort($topics);
                $attempt->update([
                    'status' => 'completed',
                    'correct_count' => $correct,
                    'score' => $score,
                    'passed' => $passed,
                    'topic_results' => array_values($topics),
                    'certificate_attempt_id' => $certificate?->id,
                    'completed_at' => now(),
                ]);

                $this->aiks->recordSnapshot($student, $score, 'certification', $attempt->id);
            });
        }

        return response()->json(['success' => true, 'already_completed' => $alreadyCompleted, 'data' => $this->results($attempt->fresh())]);
    }

    // ------------------------------------------------------------------

    /** @return array{0: ?Training, 1: ?AssessmentBlueprint} */
    protected function resolve(string $slug): array
    {
        $training = $this->progress->findCourse($slug);
        return [$training, $training?->blueprint];
    }

    /** Published questions grouped by module_index. */
    protected function pool(Training $training): Collection
    {
        return TrainingQuestion::whereHas('module', fn ($q) => $q->where('training_id', $training->id)->where('is_published', true))
            ->with('module:id,module_index')
            ->get()
            ->groupBy(fn ($q) => $q->module->module_index);
    }

    protected function plannedTotal(AssessmentBlueprint $blueprint, Collection $pool): int
    {
        return collect($blueprint->topics)->sum(fn ($t) => min($t['max'], $pool->get($t['module_index'], collect())->count()));
    }

    /**
     * Take each topic's minimum, then add questions round-robin up to each topic's maximum until the
     * blueprint total is reached. Questions from the learner's previous attempt are used last.
     */
    protected function selectQuestions(Student $student, Training $training, AssessmentBlueprint $blueprint): Collection
    {
        $lastAttempt = CertificationAttempt::where('student_id', $student->id)->where('training_id', $training->id)->latest('id')->first();
        $seen = $lastAttempt ? $lastAttempt->items()->pluck('training_question_id')->flip() : collect();

        $pool = $this->pool($training)->map(fn (Collection $qs) => $qs->shuffle()->sortBy(fn ($q) => $seen->has($q->id) ? 1 : 0)->values());
        $topics = collect($blueprint->topics);
        $take = $topics->mapWithKeys(fn ($t) => [$t['module_index'] => min($t['min'], $pool->get($t['module_index'], collect())->count())])->all();

        $total = array_sum($take);
        $added = true;
        while ($total < $blueprint->total_questions && $added) {
            $added = false;
            foreach ($topics->shuffle() as $t) {
                $i = $t['module_index'];
                if ($total < $blueprint->total_questions && $take[$i] < min($t['max'], $pool->get($i, collect())->count())) {
                    $take[$i]++;
                    $total++;
                    $added = true;
                }
            }
        }

        return $topics->flatMap(fn ($t) => $pool->get($t['module_index'], collect())->take($take[$t['module_index']]))->shuffle()->values();
    }

    protected function eligibility(Student $student, Training $training): array
    {
        $profile = $this->progress->courseProfile($training);
        $ack = CourseAcknowledgement::where('student_id', $student->id)->where('training_id', $training->id)->first();
        $modules = $this->progress->modulesWithProgress($training, $student);

        return [
            'acknowledged' => $ack !== null && $ack->version === $profile?->version,
            'modules_completed' => $modules->filter(fn ($m) => $m['progress']['passed'])->count(),
            'modules_total' => $modules->count(),
            'already_certified' => $this->progress->passedCertification($training, $student) !== null,
            'in_progress_attempt_id' => CertificationAttempt::where('student_id', $student->id)->where('training_id', $training->id)->where('status', 'in_progress')->value('id'),
        ];
    }

    protected function topicName(?AssessmentBlueprint $blueprint, int $moduleIndex): ?string
    {
        return collect($blueprint?->topics ?? [])->firstWhere('module_index', $moduleIndex)['topic'] ?? null;
    }

    protected function summary(CertificationAttempt $a): array
    {
        return [
            'id' => $a->id,
            'course' => $a->training ? ['id' => $a->training->id, 'name' => $a->training->name, 'slug' => $a->training->slug] : null,
            'status' => $a->status,
            'score' => $a->score,
            'passed' => $a->passed,
            'total_questions' => $a->total_questions,
            'correct_count' => $a->correct_count,
            'started_at' => $a->started_at?->toIso8601String(),
            'completed_at' => $a->completed_at?->toIso8601String(),
        ];
    }

    protected function presentAttempt(CertificationAttempt $attempt): array
    {
        $attempt->loadMissing('training:id,name,slug');
        $items = $attempt->items()->with('question')->orderBy('sort_order')->get();

        return $this->summary($attempt) + [
            'answered_count' => $items->whereNotNull('selected_option')->count(),
            'questions' => $items->map(fn (CertificationAttemptItem $item) => [
                'question_id' => $item->training_question_id,
                'number' => $item->sort_order,
                'question' => $item->question->question,
                'options' => $this->displayOptions($item),
                'selected_option' => $item->selected_option,
            ])->values(),
            'answers_url' => "/api/certification/attempts/{$attempt->id}/answers",
            'complete_url' => "/api/certification/attempts/{$attempt->id}/complete",
        ];
    }

    protected function results(CertificationAttempt $attempt): array
    {
        $attempt->loadMissing(['training:id,name,slug', 'certificateAttempt']);
        $blueprint = AssessmentBlueprint::where('training_id', $attempt->training_id)->first();
        $items = $attempt->items()->with('question.module')->orderBy('sort_order')->get();
        $cert = $attempt->certificateAttempt;

        return $this->summary($attempt) + [
            'pass_mark' => $blueprint?->pass_mark,
            'topic_results' => collect($attempt->topic_results ?? [])->map(fn ($t) => $t + [
                'percent' => $t['total'] ? (int) round($t['correct'] * 100 / $t['total']) : 0,
            ])->values(),
            'certificate' => $cert && $cert->certificate_token ? [
                'id' => $cert->id,
                'certificate_token' => $cert->certificate_token,
                'issued_at' => $cert->issued_at?->toIso8601String(),
                'verify_url' => rtrim((string) config('app.frontend_url'), '/') . "/certificate/verify/{$cert->certificate_token}",
                'verify_api_url' => "/api/certificate/verify/{$cert->certificate_token}",
            ] : null,
            'questions' => $items->map(function (CertificationAttemptItem $item) {
                $displayCorrect = array_search(strtoupper((string) $item->question->correct_answer), $item->options_mapping, true) ?: null;
                return [
                    'question_id' => $item->training_question_id,
                    'number' => $item->sort_order,
                    'module_index' => $item->question->module->module_index,
                    'question' => $item->question->question,
                    'options' => $this->displayOptions($item),
                    'selected_option' => $item->selected_option,
                    'correct_option' => $displayCorrect,
                    'is_correct' => (bool) $item->is_correct,
                    'explanation' => $item->question->explanation,
                    'competency_tag' => $item->question->competency_tag,
                ];
            })->values(),
        ];
    }

    /** Options keyed by displayed letter. */
    protected function displayOptions(CertificationAttemptItem $item): array
    {
        $options = array_values($item->question->options ?? []);
        $out = [];
        foreach ($item->options_mapping as $display => $original) {
            $out[$display] = $options[ord($original) - ord('A')] ?? null;
        }
        ksort($out);
        return $out;
    }
}

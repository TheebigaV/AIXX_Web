<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Api\CertificateController as WebCertificateController;
use App\Http\Controllers\Controller;
use App\Models\CertificateAttempt;
use App\Models\CertificateAttemptQuestion;
use App\Models\CertificateQuestion;
use App\Models\Training;
use App\Models\TrainingModule;
use App\Services\AiksService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    public function __construct(protected AiksService $aiks)
    {
    }

    /**
     * POST /api/assessment/attempts — Start a new attempt.
     */
    public function start(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'training_id' => 'required_without:training_slug|integer|exists:trainings,id',
            'training_slug' => 'required_without:training_id|string',
        ]);

        $training = isset($validated['training_id'])
            ? Training::findOrFail($validated['training_id'])
            : Training::where('slug', $validated['training_slug'])->firstOrFail();

        $student = $request->user();

        $attempt = CertificateAttempt::firstOrCreate([
            'student_id' => $student->id,
            'training_id' => $training->id,
            'is_completed' => false,
        ]);

        $this->ensureQuestionsGenerated($attempt, $training);

        return response()->json([
            'success' => true,
            'attempt_id' => $attempt->id,
            'training' => ['id' => $training->id, 'name' => $training->name, 'slug' => $training->slug],
            'questions' => $this->presentQuestions($attempt),
        ], 201);
    }

    /**
     * GET /api/assessment/attempts/{id} — Resume an attempt.
     */
    public function resume(int $id, Request $request): JsonResponse
    {
        $attempt = CertificateAttempt::where('student_id', $request->user()->id)->findOrFail($id);

        return response()->json([
            'success' => true,
            'attempt_id' => $attempt->id,
            'is_completed' => $attempt->is_completed,
            'score' => $attempt->score,
            'passed' => $attempt->passed,
            'questions' => $this->presentQuestions($attempt, true),
        ], 200);
    }

    /**
     * POST /api/assessment/attempts/{id}/answers — Submit a single answer.
     */
    public function submitAnswer(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'attempt_question_id' => 'required|integer',
            'selected_option' => 'required|string|max:5',
        ]);

        $attempt = CertificateAttempt::where('student_id', $request->user()->id)
            ->where('is_completed', false)
            ->findOrFail($id);

        $attemptQuestion = CertificateAttemptQuestion::where('certificate_attempt_id', $attempt->id)
            ->findOrFail($validated['attempt_question_id']);

        $attemptQuestion->update(['selected_option_key' => strtoupper($validated['selected_option'])]);

        return response()->json([
            'success' => true,
            'message' => 'Answer recorded.',
        ], 200);
    }

    /**
     * POST /api/assessment/attempts/{id}/complete — Complete and score the attempt.
     */
    public function complete(int $id, Request $request): JsonResponse
    {
        $student = $request->user();

        $attempt = CertificateAttempt::where('student_id', $student->id)
            ->where('is_completed', false)
            ->findOrFail($id);

        $attemptQuestions = CertificateAttemptQuestion::where('certificate_attempt_id', $attempt->id)
            ->with('question')
            ->get();

        $total = $attemptQuestions->count();
        if ($total === 0) {
            return response()->json(['success' => false, 'message' => 'No questions found for this attempt.'], 400);
        }

        $correct = 0;
        foreach ($attemptQuestions as $aq) {
            $isCorrect = $this->gradeAnswer($aq);
            $aq->update(['is_correct' => $isCorrect]);
            if ($isCorrect) {
                $correct++;
            }
        }

        $score = (int) round(($correct / $total) * 100);
        $passed = $score >= 80;

        $attempt->update([
            'is_completed' => true,
            'score' => $score,
            'passed' => $passed,
            'completed_at' => now(),
        ]);

        $snapshot = $this->aiks->recordSnapshot($student, $score, 'assessment', $attempt->id);

        return response()->json([
            'success' => true,
            'attempt_id' => $attempt->id,
            'score' => $score,
            'correct_count' => $correct,
            'total_questions' => $total,
            'passed' => $passed,
            'certificate_token' => $attempt->fresh()->certificate_token,
            'aiks' => ['score' => $snapshot->score, 'level' => $snapshot->level],
        ], 200);
    }

    /**
     * GET /api/assessment/results — Get all assessment results.
     */
    public function results(Request $request): JsonResponse
    {
        $attempts = CertificateAttempt::where('student_id', $request->user()->id)
            ->where('is_completed', true)
            ->with('training:id,name,slug')
            ->orderByDesc('completed_at')
            ->get()
            ->map(fn (CertificateAttempt $a) => [
                'attempt_id' => $a->id,
                'training' => $a->training?->name,
                'training_slug' => $a->training?->slug,
                'score' => $a->score,
                'passed' => $a->passed,
                'completed_at' => $a->completed_at?->toIso8601String(),
                'certificate_token' => $a->certificate_token,
            ]);

        return response()->json(['success' => true, 'count' => $attempts->count(), 'data' => $attempts], 200);
    }

    /**
     * POST /api/assessment/submit — (Legacy) Bulk submit assessment answers.
     * Delegates to the existing web certificate test flow so behaviour matches exactly.
     */
    public function legacySubmit(Request $request, WebCertificateController $webCertificate): JsonResponse
    {
        return $webCertificate->submitTest($request);
    }

    /**
     * GET /api/assessment/questions/{moduleId} — (Legacy) Get questions for a module.
     */
    public function legacyModuleQuestions(int $moduleId): JsonResponse
    {
        $module = TrainingModule::with('questions')->findOrFail($moduleId);

        $questions = $module->questions->map(function ($q, $idx) {
            $options = is_array($q->options) ? $q->options : (json_decode($q->options, true) ?? []);
            $letters = ['A', 'B', 'C', 'D', 'E', 'F'];
            $formatted = [];
            foreach (array_values($options) as $i => $text) {
                $formatted[$letters[$i] ?? (string) $i] = $text;
            }

            return [
                'id' => $q->id,
                'question_index' => $idx + 1,
                'question' => $q->question,
                'options' => $formatted,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'module_id' => $module->id,
            'module_index' => $module->module_index,
            'title' => $module->title,
            'total_questions' => $questions->count(),
            'questions' => $questions,
        ], 200);
    }

    protected function ensureQuestionsGenerated(CertificateAttempt $attempt, Training $training): void
    {
        $existing = CertificateAttemptQuestion::where('certificate_attempt_id', $attempt->id)
            ->with('question')
            ->get()
            ->filter(fn ($aq) => $aq->question !== null && is_array($aq->options_mapping));

        if ($existing->isNotEmpty()) {
            return;
        }

        CertificateAttemptQuestion::where('certificate_attempt_id', $attempt->id)->delete();

        $questions = CertificateQuestion::where('training_id', $training->id)
            ->where('is_active', true)
            ->inRandomOrder()
            ->limit(20)
            ->get();

        if ($questions->isEmpty()) {
            $questions = CertificateQuestion::where('is_active', true)->inRandomOrder()->limit(20)->get();
        }

        foreach ($questions as $q) {
            $originalOptions = $q->options ?? [];
            if (empty($originalOptions) || !is_array($originalOptions)) {
                continue;
            }

            $indices = array_keys($originalOptions);
            shuffle($indices);

            $letters = range('A', 'Z');
            $mapping = [];
            foreach ($indices as $i => $originalIndex) {
                $mapping[$letters[$i]] = $originalIndex;
            }

            CertificateAttemptQuestion::create([
                'certificate_attempt_id' => $attempt->id,
                'certificate_question_id' => $q->id,
                'options_mapping' => $mapping,
            ]);
        }
    }

    protected function presentQuestions(CertificateAttempt $attempt, bool $withSelection = false): array
    {
        $attemptQuestions = CertificateAttemptQuestion::where('certificate_attempt_id', $attempt->id)
            ->with('question')
            ->get();

        $result = [];
        foreach ($attemptQuestions as $aq) {
            $q = $aq->question;
            if (!$q || !is_array($aq->options_mapping)) {
                continue;
            }

            $options = [];
            foreach ($aq->options_mapping as $letter => $originalIndex) {
                if (isset($q->options[$originalIndex])) {
                    $options[$letter] = $q->options[$originalIndex];
                }
            }

            $entry = [
                'attempt_question_id' => $aq->id,
                'question' => $q->question,
                'options' => $options,
            ];

            if ($withSelection) {
                $entry['selected_option'] = $aq->selected_option_key;
            }

            $result[] = $entry;
        }

        return $result;
    }

    protected function gradeAnswer(CertificateAttemptQuestion $aq): bool
    {
        $q = $aq->question;
        if (!$q || !$aq->selected_option_key || !is_array($aq->options_mapping)) {
            return false;
        }

        $mappedOriginalIndex = $aq->options_mapping[$aq->selected_option_key] ?? null;

        return $mappedOriginalIndex !== null && $mappedOriginalIndex === $q->correct_answer_index;
    }
}

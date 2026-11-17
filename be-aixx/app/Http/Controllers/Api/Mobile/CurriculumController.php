<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\CourseAcknowledgement;
use App\Models\KnowledgeCheck;
use App\Models\KnowledgeCheckResponse;
use App\Models\ModuleContent;
use App\Models\ModuleStepProgress;
use App\Models\Student;
use App\Models\Training;
use App\Models\TrainingModule;
use App\Services\LearnerProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Structured curriculum delivery following the AIXX lesson pattern:
 * Learn → Check → Scenario → Review → Assess.
 * Content endpoints are public; learner state is included when a bearer token is sent.
 */
class CurriculumController extends Controller
{
    public const STEPS = ['learn', 'check', 'scenario', 'review', 'assess'];

    public function __construct(protected LearnerProgressService $progress)
    {
    }

    /**
     * GET /api/courses/{slug}/curriculum — Course outcomes, safety boundary, pathway level and module outline.
     */
    public function curriculum(string $slug, Request $request): JsonResponse
    {
        $training = $this->progress->findCourse($slug);
        $lang = $request->query('lang');
        $profile = $training ? $this->progress->courseProfile($training, $lang) : null;

        if (!$profile) {
            return $this->notFound('No structured curriculum for this course.');
        }

        $student = $this->student($request);
        $modules = $training->modules()->where('is_published', true)->with('contents')->get();
        $ack = $student ? CourseAcknowledgement::where('student_id', $student->id)->where('training_id', $training->id)->first() : null;
        $level = $training->pathwayLevel;

        return response()->json([
            'success' => true,
            'data' => [
                'course' => ['id' => $training->id, 'name' => $training->name, 'slug' => $training->slug, 'duration' => $training->duration],
                'lang' => $profile->lang,
                'pathway' => $level ? ['slug' => $level->pathway_slug, 'name' => $level->pathway_name, 'level' => $level->level, 'level_name' => $level->level_name] : null,
                'target_learner' => $profile->target_learner,
                'delivery' => $profile->delivery,
                'outcomes' => $profile->outcomes ?? [],
                'competency_areas' => $profile->competency_areas ?? [],
                'boundary_statement' => $profile->boundary_statement,
                'safety_boundary' => $profile->safety_boundary,
                'version' => $profile->version,
                'effective_date' => $profile->effective_date?->toDateString(),
                'acknowledgement' => [
                    'required' => true,
                    'acknowledged' => $ack !== null && $ack->version === $profile->version,
                    'acknowledged_at' => $ack?->acknowledged_at?->toIso8601String(),
                ],
                'modules' => $modules->map(function (TrainingModule $m) use ($lang, $student, $training) {
                    $content = $this->progress->localized($m->contents, $lang);
                    $progress = $student ? $this->progress->moduleProgress($student, $training->slug, $m->module_index) : null;
                    return [
                        'module_index' => $m->module_index,
                        'title' => $m->title,
                        'study_time' => $content?->study_time,
                        'competency_area' => $content?->competency_area,
                        'objectives' => $content?->objectives ?? [],
                        'passed' => $progress['passed'] ?? null,
                        'best_score' => $progress['best_score'] ?? null,
                    ];
                })->values(),
            ],
        ]);
    }

    /**
     * POST /api/courses/{slug}/acknowledge — Accept the course's training/safety boundary statement.
     */
    public function acknowledge(string $slug, Request $request): JsonResponse
    {
        $training = $this->progress->findCourse($slug);
        $profile = $training ? $this->progress->courseProfile($training) : null;

        if (!$profile) {
            return $this->notFound('No structured curriculum for this course.');
        }

        $request->validate(['accepted' => 'required|accepted']);

        $ack = CourseAcknowledgement::updateOrCreate(
            ['student_id' => $request->user()->id, 'training_id' => $training->id],
            ['version' => $profile->version, 'acknowledged_at' => now()]
        );

        return response()->json([
            'success' => true,
            'message' => 'Training boundary acknowledged.',
            'data' => [
                'course_slug' => $training->slug,
                'version' => $ack->version,
                'acknowledged_at' => $ack->acknowledged_at->toIso8601String(),
                'boundary_statement' => $profile->boundary_statement,
            ],
        ]);
    }

    /**
     * GET /api/courses/{slug}/modules/{i}/lesson — Full lesson package: objectives, learning cards, terminology,
     * scenarios, knowledge-check count, summary and the learner's step progress.
     */
    public function lesson(string $slug, int $moduleIndex, Request $request): JsonResponse
    {
        [$training, $module, $content] = $this->resolve($slug, $moduleIndex, $request->query('lang'));
        if (!$content) {
            return $this->notFound('No structured lesson for this module.');
        }

        $student = $this->student($request);
        $lastIndex = (int) $training->modules()->where('is_published', true)->max('module_index');

        return response()->json([
            'success' => true,
            'data' => $this->moduleHeader($training, $module, $content) + [
                'assessment_approach' => $content->assessment_approach,
                'operational_boundary' => $content->operational_boundary,
                'objectives' => $content->objectives ?? [],
                'cards' => collect($content->cards ?? [])->values()->map(fn ($c, $i) => ['index' => $i + 1] + $c),
                'terminology' => $content->terminology ?? [],
                'scenarios' => $this->publicScenarios($content),
                'knowledge_checks_count' => $this->checksFor($module, $content->lang)->count(),
                'summary' => $content->summary ?? [],
                'steps' => $student ? $this->steps($student, $training, $module) : null,
                'quiz_url' => "/api/courses/{$training->slug}/modules/{$moduleIndex}",
                'previous_module' => $moduleIndex > 1 ? $moduleIndex - 1 : null,
                'next_module' => $moduleIndex < $lastIndex ? $moduleIndex + 1 : null,
            ],
        ]);
    }

    /** GET /api/courses/{slug}/modules/{i}/terminology */
    public function terminology(string $slug, int $moduleIndex, Request $request): JsonResponse
    {
        [$training, $module, $content] = $this->resolve($slug, $moduleIndex, $request->query('lang'));
        if (!$content) {
            return $this->notFound('No structured lesson for this module.');
        }

        return response()->json(['success' => true, 'data' => $this->moduleHeader($training, $module, $content) + [
            'terms' => $content->terminology ?? [],
        ]]);
    }

    /** GET /api/courses/{slug}/glossary — Every key term across the course, with the modules that use it. */
    public function glossary(string $slug, Request $request): JsonResponse
    {
        $training = $this->progress->findCourse($slug);
        if (!$training || !$this->progress->courseProfile($training)) {
            return $this->notFound('No structured curriculum for this course.');
        }

        $lang = $request->query('lang');
        $terms = [];
        foreach ($training->modules()->where('is_published', true)->with('contents')->get() as $m) {
            foreach ($this->progress->localized($m->contents, $lang)?->terminology ?? [] as $term) {
                $key = mb_strtolower($term);
                $terms[$key] ??= ['term' => $term, 'modules' => []];
                $terms[$key]['modules'][] = $m->module_index;
            }
        }

        $data = collect($terms)->sortBy(fn ($t) => mb_strtolower($t['term']))->values();

        return response()->json(['success' => true, 'count' => $data->count(), 'data' => $data]);
    }

    /** GET /api/courses/{slug}/modules/{i}/scenarios */
    public function scenarios(string $slug, int $moduleIndex, Request $request): JsonResponse
    {
        [$training, $module, $content] = $this->resolve($slug, $moduleIndex, $request->query('lang'));
        if (!$content) {
            return $this->notFound('No structured lesson for this module.');
        }

        return response()->json(['success' => true, 'data' => $this->moduleHeader($training, $module, $content) + [
            'scenarios' => $this->publicScenarios($content),
        ]]);
    }

    /** GET /api/courses/{slug}/modules/{i}/summary */
    public function summary(string $slug, int $moduleIndex, Request $request): JsonResponse
    {
        [$training, $module, $content] = $this->resolve($slug, $moduleIndex, $request->query('lang'));
        if (!$content) {
            return $this->notFound('No structured lesson for this module.');
        }

        return response()->json(['success' => true, 'data' => $this->moduleHeader($training, $module, $content) + [
            'summary' => $content->summary ?? [],
            'objectives' => $content->objectives ?? [],
        ]]);
    }

    /**
     * GET /api/courses/{slug}/modules/{i}/knowledge-checks — Questions only; the suggested answer is
     * included only for checks the authenticated learner has already answered.
     */
    public function knowledgeChecks(string $slug, int $moduleIndex, Request $request): JsonResponse
    {
        [$training, $module, $content] = $this->resolve($slug, $moduleIndex, $request->query('lang'));
        if (!$content) {
            return $this->notFound('No structured lesson for this module.');
        }

        $student = $this->student($request);
        $checks = $this->checksFor($module, $content->lang);
        $responses = $student
            ? KnowledgeCheckResponse::where('student_id', $student->id)->whereIn('knowledge_check_id', $checks->pluck('id'))->latest('id')->get()->unique('knowledge_check_id')->keyBy('knowledge_check_id')
            : collect();

        return response()->json(['success' => true, 'data' => $this->moduleHeader($training, $module, $content) + [
            'answered_count' => $responses->count(),
            'total' => $checks->count(),
            'checks' => $checks->map(fn (KnowledgeCheck $kc) => [
                'id' => $kc->id,
                'number' => $kc->sort_order,
                'question' => $kc->question,
                'answered' => $responses->has($kc->id),
                'your_answer' => $responses->get($kc->id)?->answer,
                'suggested_answer' => $responses->has($kc->id) ? $kc->suggested_answer : null,
            ])->values(),
        ]]);
    }

    /**
     * POST /api/courses/{slug}/modules/{i}/knowledge-checks/{id}/answer — Save the learner's answer and
     * reveal the suggested answer (explanations appear only after submission).
     */
    public function answerKnowledgeCheck(string $slug, int $moduleIndex, int $checkId, Request $request): JsonResponse
    {
        [, $module] = $this->resolve($slug, $moduleIndex, null);
        $check = $module ? KnowledgeCheck::where('training_module_id', $module->id)->find($checkId) : null;
        if (!$check) {
            return $this->notFound('Knowledge check not found.');
        }

        $validated = $request->validate(['answer' => 'required|string|max:2000']);

        KnowledgeCheckResponse::create([
            'student_id' => $request->user()->id,
            'knowledge_check_id' => $check->id,
            'answer' => $validated['answer'],
        ]);

        $checks = $this->checksFor($module, $check->lang);
        $answered = KnowledgeCheckResponse::where('student_id', $request->user()->id)
            ->whereIn('knowledge_check_id', $checks->pluck('id'))
            ->distinct()
            ->count('knowledge_check_id');

        return response()->json(['success' => true, 'data' => [
            'id' => $check->id,
            'question' => $check->question,
            'your_answer' => $validated['answer'],
            'suggested_answer' => $check->suggested_answer,
            'answered_count' => $answered,
            'total' => $checks->count(),
            'all_answered' => $answered >= $checks->count(),
        ]]);
    }

    /**
     * POST /api/courses/{slug}/modules/{i}/steps/{step}/complete — Mark learn / check / scenario / review done.
     * "check" requires every knowledge check answered; "assess" completes automatically when the module quiz is passed.
     */
    public function completeStep(string $slug, int $moduleIndex, string $step, Request $request): JsonResponse
    {
        [$training, $module, $content] = $this->resolve($slug, $moduleIndex, null);
        if (!$content) {
            return $this->notFound('No structured lesson for this module.');
        }

        if (!in_array($step, self::STEPS, true)) {
            return response()->json(['success' => false, 'message' => 'Unknown step. Use one of: ' . implode(', ', self::STEPS) . '.'], 422);
        }
        if ($step === 'assess') {
            return response()->json(['success' => false, 'message' => 'The assess step completes when the module quiz is passed.'], 422);
        }

        /** @var Student $student */
        $student = $request->user();

        if ($step === 'check') {
            $checks = $module->knowledgeChecks()->where('lang', $content->lang)->pluck('id');
            $answered = KnowledgeCheckResponse::where('student_id', $student->id)->whereIn('knowledge_check_id', $checks)->distinct()->count('knowledge_check_id');
            if ($answered < $checks->count()) {
                return response()->json(['success' => false, 'message' => "Answer all knowledge checks first ({$answered}/{$checks->count()})."], 422);
            }
        }

        ModuleStepProgress::firstOrCreate(
            ['student_id' => $student->id, 'training_module_id' => $module->id, 'step' => $step],
            ['completed_at' => now()]
        );

        return response()->json(['success' => true, 'data' => $this->steps($student, $training, $module)]);
    }

    // ------------------------------------------------------------------

    /** @return array{0: ?Training, 1: ?TrainingModule, 2: ?ModuleContent} */
    protected function resolve(string $slug, int $moduleIndex, ?string $lang): array
    {
        $training = $this->progress->findCourse($slug);
        $module = $training ? $this->progress->findModule($training, $moduleIndex) : null;
        $content = $module ? $this->progress->localized($module->contents()->get(), $lang) : null;

        return [$training, $module, $content];
    }

    protected function checksFor(TrainingModule $module, string $lang)
    {
        $checks = $module->knowledgeChecks()->where('lang', $lang)->get();
        return $checks->isNotEmpty() ? $checks : $module->knowledgeChecks()->where('lang', 'en')->get();
    }

    protected function moduleHeader(Training $training, TrainingModule $module, ModuleContent $content): array
    {
        return [
            'course_slug' => $training->slug,
            'course_name' => $training->name,
            'module_index' => $module->module_index,
            'title' => $module->title,
            'lang' => $content->lang,
            'study_time' => $content->study_time,
            'competency_area' => $content->competency_area,
            'version' => $content->version,
            'effective_date' => $content->effective_date?->toDateString(),
        ];
    }

    protected function steps(Student $student, Training $training, TrainingModule $module): array
    {
        $done = ModuleStepProgress::where('student_id', $student->id)->where('training_module_id', $module->id)->get()->keyBy('step');
        $quiz = $this->progress->moduleProgress($student, $training->slug, $module->module_index);

        $steps = collect(self::STEPS)->map(fn ($s) => [
            'step' => $s,
            'completed' => $s === 'assess' ? $quiz['passed'] : $done->has($s),
            'completed_at' => $s === 'assess' ? $quiz['completed_at'] : $done->get($s)?->completed_at?->toIso8601String(),
        ]);

        return [
            'items' => $steps->values(),
            'next_step' => $steps->firstWhere('completed', false)['step'] ?? null,
            'module_completed' => $steps->every(fn ($s) => $s['completed']),
        ];
    }

    protected function student(Request $request): ?Student
    {
        $user = $request->user('student');
        return $user instanceof Student ? $user : null;
    }

    protected function notFound(string $message): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $message], 404);
    }

    /** Scenarios without internal storage paths. */
    protected function publicScenarios(ModuleContent $content): array
    {
        return collect($content->scenarios ?? [])->map(fn ($s) => [
            'title' => $s['title'] ?? null,
            'description' => $s['description'] ?? null,
            'image_url' => $s['image_url'] ?? null,
        ])->values()->all();
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AssessmentBlueprint;
use App\Models\CourseProfile;
use App\Models\KnowledgeCheck;
use App\Models\ModuleContent;
use App\Models\Training;
use App\Models\TrainingModule;
use App\Services\ScenarioImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin management of structured curriculum content: course profile, module
 * lesson packages (any language), knowledge checks, scenario images and the
 * certification blueprint (question count, topic balance, pass mark).
 */
class CurriculumContentController extends Controller
{
    // ---- Certification blueprint ------------------------------------

    /** GET /api/admin/trainings/{id}/blueprint */
    public function showBlueprint(int $id): JsonResponse
    {
        $training = Training::findOrFail($id);
        $blueprint = $training->blueprint;

        return response()->json(['success' => true, 'data' => $blueprint ? $this->blueprintPayload($training, $blueprint) : null]);
    }

    /** PUT /api/admin/trainings/{id}/blueprint — Create or replace (pass_mark, total_questions, topics). */
    public function updateBlueprint(int $id, Request $request): JsonResponse
    {
        $training = Training::findOrFail($id);
        $existing = $training->blueprint;
        $req = $existing ? 'sometimes' : 'required';

        $data = $request->validate([
            'total_questions' => [$req, 'integer', 'min:1', 'max:500'],
            'pass_mark' => [$req, 'integer', 'min:1', 'max:100'],
            'topics' => [$req, 'array', 'min:1'],
            'topics.*.module_index' => 'required|integer|min:1|distinct',
            'topics.*.topic' => 'required|string|max:255',
            'topics.*.min' => 'required|integer|min:0',
            'topics.*.max' => 'required|integer|gte:topics.*.min',
        ]);

        $topics = collect($data['topics'] ?? $existing->topics);
        $total = $data['total_questions'] ?? $existing->total_questions;
        if ($topics->sum('min') > $total) {
            return response()->json(['success' => false, 'message' => 'The sum of topic minimums exceeds total_questions.'], 422);
        }

        $blueprint = AssessmentBlueprint::updateOrCreate(['training_id' => $training->id], [
            'total_questions' => $total,
            'pass_mark' => $data['pass_mark'] ?? $existing->pass_mark,
            'topics' => $topics->map(fn ($t) => [
                'module_index' => (int) $t['module_index'],
                'topic' => $t['topic'],
                'min' => (int) $t['min'],
                'max' => (int) $t['max'],
            ])->values()->all(),
        ]);

        return response()->json(['success' => true, 'data' => $this->blueprintPayload($training, $blueprint)]);
    }

    // ---- Course profile ---------------------------------------------

    /** GET /api/admin/trainings/{id}/course-profile?lang= */
    public function showCourseProfile(int $id, Request $request): JsonResponse
    {
        $training = Training::findOrFail($id);
        $profile = $training->profiles()->where('lang', $request->query('lang', 'en'))->first();

        return response()->json(['success' => true, 'data' => $profile, 'languages' => $training->profiles()->pluck('lang')]);
    }

    /** PUT /api/admin/trainings/{id}/course-profile — Create or update one language version. */
    public function updateCourseProfile(int $id, Request $request): JsonResponse
    {
        $training = Training::findOrFail($id);
        $data = $request->validate([
            'lang' => 'sometimes|string|max:10',
            'target_learner' => 'nullable|string|max:255',
            'delivery' => 'nullable|string|max:255',
            'boundary_statement' => 'nullable|string',
            'safety_boundary' => 'nullable|string',
            'outcomes' => 'nullable|array',
            'outcomes.*' => 'string',
            'competency_areas' => 'nullable|array',
            'competency_areas.*.area' => 'required|string|max:255',
            'competency_areas.*.description' => 'nullable|string',
            'version' => 'nullable|string|max:50',
            'effective_date' => 'nullable|date',
        ]);

        $lang = $data['lang'] ?? 'en';
        unset($data['lang']);
        $profile = CourseProfile::updateOrCreate(['training_id' => $training->id, 'lang' => $lang], $data);

        return response()->json(['success' => true, 'data' => $profile]);
    }

    // ---- Module lesson content --------------------------------------

    /** GET /api/admin/training-modules/{id}/content?lang= */
    public function showModuleContent(int $id, Request $request): JsonResponse
    {
        $module = TrainingModule::findOrFail($id);
        $lang = $request->query('lang', 'en');

        return response()->json(['success' => true, 'data' => [
            'module' => ['id' => $module->id, 'training_id' => $module->training_id, 'module_index' => $module->module_index, 'title' => $module->title],
            'content' => $module->contents()->where('lang', $lang)->first(),
            'knowledge_checks' => $module->knowledgeChecks()->where('lang', $lang)->get(['id', 'sort_order', 'question', 'suggested_answer']),
            'languages' => $module->contents()->pluck('lang'),
        ]]);
    }

    /**
     * PUT /api/admin/training-modules/{id}/content — Create or update one language version of a lesson.
     * knowledge_checks, when sent, replaces the list for that language (matched by position, so learner answers are kept).
     */
    public function updateModuleContent(int $id, Request $request): JsonResponse
    {
        $module = TrainingModule::findOrFail($id);
        $data = $request->validate([
            'lang' => 'sometimes|string|max:10',
            'study_time' => 'nullable|string|max:255',
            'assessment_approach' => 'nullable|string|max:255',
            'operational_boundary' => 'nullable|string',
            'competency_area' => 'nullable|string|max:255',
            'objectives' => 'nullable|array',
            'objectives.*' => 'string',
            'terminology' => 'nullable|array',
            'terminology.*' => 'string|max:255',
            'cards' => 'nullable|array',
            'cards.*.heading' => 'nullable|string|max:255',
            'cards.*.body' => 'required|string',
            'cards.*.type' => 'nullable|in:text,warning',
            'scenarios' => 'nullable|array',
            'scenarios.*.title' => 'required|string|max:255',
            'scenarios.*.description' => 'nullable|string',
            'scenarios.*.image_url' => 'nullable|string|max:2048',
            'summary' => 'nullable|array',
            'summary.*' => 'string',
            'version' => 'nullable|string|max:50',
            'effective_date' => 'nullable|date',
            'knowledge_checks' => 'sometimes|array',
            'knowledge_checks.*.question' => 'required|string',
            'knowledge_checks.*.suggested_answer' => 'required|string',
        ]);

        $lang = $data['lang'] ?? 'en';
        $checks = $data['knowledge_checks'] ?? null;
        unset($data['lang'], $data['knowledge_checks']);

        if (isset($data['cards'])) {
            $data['cards'] = collect($data['cards'])->map(fn ($c) => ['heading' => $c['heading'] ?? null, 'body' => $c['body'], 'type' => $c['type'] ?? 'text'])->all();
        }

        DB::transaction(function () use ($module, $lang, $data, $checks) {
            ModuleContent::updateOrCreate(['training_module_id' => $module->id, 'lang' => $lang], $data);

            if ($checks !== null) {
                foreach (array_values($checks) as $i => $kc) {
                    KnowledgeCheck::updateOrCreate(
                        ['training_module_id' => $module->id, 'lang' => $lang, 'sort_order' => $i + 1],
                        ['question' => $kc['question'], 'suggested_answer' => $kc['suggested_answer']]
                    );
                }
                KnowledgeCheck::where('training_module_id', $module->id)->where('lang', $lang)->where('sort_order', '>', count($checks))->delete();
            }
        });

        return $this->showModuleContent($module->id, new Request(['lang' => $lang]));
    }

    /**
     * POST /api/admin/training-modules/{id}/scenarios/{number}/image — Upload the illustration for a scenario
     * (multipart "image", optional "lang"). Images should be generic and non-aircraft-specific.
     */
    public function uploadScenarioImage(int $id, int $number, Request $request): JsonResponse
    {
        $module = TrainingModule::findOrFail($id);
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp,svg|max:5120',
            'lang' => 'sometimes|string|max:10',
        ]);

        $content = $module->contents()->where('lang', $request->input('lang', 'en'))->first();
        if (!isset(($content?->scenarios ?? [])[$number - 1])) {
            return response()->json(['success' => false, 'message' => "Scenario {$number} does not exist for this module."], 404);
        }

        $url = app(ScenarioImageService::class)->attach($content, $number, $request->file('image'));

        return response()->json(['success' => true, 'data' => [
            'module_id' => $module->id,
            'scenario' => $number,
            'image_url' => $url,
        ]]);
    }

    protected function blueprintPayload(Training $training, AssessmentBlueprint $blueprint): array
    {
        $pool = $training->modules()->where('is_published', true)->withCount('questions')->pluck('questions_count', 'module_index');

        return [
            'training_id' => $training->id,
            'total_questions' => $blueprint->total_questions,
            'pass_mark' => $blueprint->pass_mark,
            'topics' => collect($blueprint->topics)->map(fn ($t) => $t + [
                'pool_size' => (int) ($pool[$t['module_index']] ?? 0),
                'pool_short' => ($pool[$t['module_index']] ?? 0) < $t['min'],
            ])->values(),
            'max_possible_questions' => collect($blueprint->topics)->sum(fn ($t) => min($t['max'], (int) ($pool[$t['module_index']] ?? 0))),
        ];
    }
}

<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CourseController as WebCourseController;
use App\Models\LearningPath;
use App\Models\Student;
use App\Models\StudentRoadmap;
use App\Models\Training;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Destination roadmaps with study-load control.
 *
 * A destination is an active learning path (e.g. "AI Engineer"); its courses,
 * in sort_order, are the roadmap steps and each course's modules are the
 * schedulable units. The learner's weekly study hours ("load") spread the
 * remaining modules across weeks, giving each one a due date.
 */
class RoadmapController extends Controller
{
    /** Estimated study time for one module (study notes + 30 MCQs). */
    public const MODULE_HOURS = 4;

    public function __construct(protected WebCourseController $webCourses)
    {
    }

    /**
     * GET /api/roadmap/destinations — Destinations a learner can aim for. Optional ?q= search.
     */
    public function destinations(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        $paths = LearningPath::where('is_active', true)
            ->with('trainings')
            ->get();

        if ($q !== '') {
            $paths = $this->rankByQuery($paths, $q);
        }

        $data = $paths->map(function (LearningPath $path) {
            $modules = $this->pathModules($path)->count();
            return [
                'id' => $path->id,
                'name' => $path->name,
                'slug' => $path->slug,
                'description' => $path->description,
                'courses_count' => $path->trainings->count(),
                'modules_count' => $modules,
                'estimated_hours' => $modules * self::MODULE_HOURS,
            ];
        })->values();

        return response()->json(['success' => true, 'count' => $data->count(), 'data' => $data], 200);
    }

    /**
     * GET /api/roadmap — The learner's current roadmap with live progress.
     */
    public function show(Request $request): JsonResponse
    {
        $roadmap = $request->user()->roadmap()->with('learningPath')->first();

        if (!$roadmap) {
            return response()->json(['success' => false, 'message' => 'No roadmap yet. Choose a destination first.'], 404);
        }

        return response()->json(['success' => true, 'data' => $this->present($roadmap, $request->user())], 200);
    }

    /**
     * POST /api/roadmap — Set a destination and study load. Replaces any existing roadmap.
     * Body: destination (path id, slug or free text), hours_per_week (1–40), start_date (optional).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'destination' => 'required|string|max:255',
            'hours_per_week' => 'required|integer|min:1|max:40',
            'start_date' => 'nullable|date',
        ]);

        $path = $this->matchDestination($validated['destination']);

        if (!$path) {
            return response()->json([
                'success' => false,
                'message' => 'No roadmap found for that destination.',
                'suggestions' => LearningPath::where('is_active', true)->get(['id', 'name', 'slug']),
            ], 422);
        }

        /** @var Student $student */
        $student = $request->user();
        $startDate = Carbon::parse($validated['start_date'] ?? today())->startOfDay();

        $roadmap = StudentRoadmap::updateOrCreate(
            ['student_id' => $student->id],
            [
                'learning_path_id' => $path->id,
                'destination_query' => $validated['destination'],
                'hours_per_week' => $validated['hours_per_week'],
                'start_date' => $startDate,
                'plan' => $this->buildPlan($path, $student, $validated['hours_per_week'], $startDate),
            ]
        );

        return response()->json(['success' => true, 'data' => $this->present($roadmap->load('learningPath'), $student)], 201);
    }

    /**
     * PATCH /api/roadmap/load — Change weekly study hours; re-plans the remaining modules.
     * Body: hours_per_week (1–40), start_date (optional, defaults to today).
     */
    public function updateLoad(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hours_per_week' => 'required|integer|min:1|max:40',
            'start_date' => 'nullable|date',
        ]);

        /** @var Student $student */
        $student = $request->user();
        $roadmap = $student->roadmap()->with('learningPath.trainings')->first();

        if (!$roadmap) {
            return response()->json(['success' => false, 'message' => 'No roadmap yet. Choose a destination first.'], 404);
        }

        $startDate = Carbon::parse($validated['start_date'] ?? today())->startOfDay();

        $roadmap->update([
            'hours_per_week' => $validated['hours_per_week'],
            'start_date' => $startDate,
            'plan' => $this->buildPlan($roadmap->learningPath, $student, $validated['hours_per_week'], $startDate),
        ]);

        return response()->json(['success' => true, 'data' => $this->present($roadmap, $student)], 200);
    }

    /**
     * DELETE /api/roadmap — Clear the learner's roadmap.
     */
    public function destroy(Request $request): JsonResponse
    {
        $request->user()->roadmap()->delete();

        return response()->json(['success' => true, 'message' => 'Roadmap removed.'], 200);
    }

    // ------------------------------------------------------------------

    /** Resolve a destination by id, slug, name, or best keyword match on name/description. */
    protected function matchDestination(string $destination): ?LearningPath
    {
        $destination = trim($destination);
        $active = LearningPath::where('is_active', true)->with('trainings')->get();

        $exact = $active->first(fn ($p) => (is_numeric($destination) && $p->id === (int) $destination)
            || $p->slug === Str::slug($destination)
            || Str::lower($p->name) === Str::lower($destination));

        return $exact ?? $this->rankByQuery($active, $destination)->first();
    }

    /** Paths matching the query, best first: name containment, then keyword hits. Non-matching paths are dropped. */
    protected function rankByQuery(Collection $paths, string $q): Collection
    {
        $needle = Str::lower($q);
        $words = collect(preg_split('/[^a-z0-9]+/', $needle))->filter(fn ($w) => strlen($w) >= 2);

        return $paths
            ->map(function (LearningPath $p) use ($needle, $words) {
                $name = Str::lower($p->name);
                $haystack = $name . ' ' . Str::lower((string) $p->description);
                $score = (Str::contains($name, $needle) ? 100 : 0)
                    + $words->filter(fn ($w) => Str::contains($name, $w))->count() * 10
                    + $words->filter(fn ($w) => Str::contains($haystack, $w))->count();
                return ['path' => $p, 'score' => $score];
            })
            ->filter(fn ($r) => $r['score'] > 0)
            ->sortByDesc('score')
            ->pluck('path')
            ->values();
    }

    /**
     * Ordered modules of every course in the path: published CMS modules when a
     * course has them, otherwise the default 5-module structure (same as /contents).
     */
    protected function pathModules(LearningPath $path): Collection
    {
        $path->loadMissing(['trainings.modules' => fn ($q) => $q->where('is_published', true)]);

        return $path->trainings->values()->flatMap(function (Training $t, int $order) {
            $modules = $t->modules->isNotEmpty()
                ? $t->modules->values()->map(fn ($m, $i) => ['module_index' => $m->module_index ?: $i + 1, 'title' => $m->title])
                : collect($this->webCourses->generateDefault5ModulesStructure($t->name))
                    ->map(fn ($m) => ['module_index' => $m['module_index'], 'title' => $m['title']]);

            return $modules->map(fn ($m) => $m + [
                'step' => $order + 1,
                'training_id' => $t->id,
                'course_slug' => $t->slug,
                'course_name' => $t->name,
            ]);
        })->values();
    }

    /**
     * Spread the not-yet-passed modules over weeks at hours_per_week.
     * Modules already passed are kept in the plan without a week.
     */
    protected function buildPlan(LearningPath $path, Student $student, int $hoursPerWeek, Carbon $startDate): array
    {
        $hours = 0;

        return $this->pathModules($path)->map(function ($m) use ($student, $hoursPerWeek, $startDate, &$hours) {
            if ($this->moduleProgress($student, $m['course_slug'], $m['module_index'])['passed']) {
                return $m + ['week' => null, 'due_date' => null];
            }

            $hours += self::MODULE_HOURS;
            $week = (int) ceil($hours / $hoursPerWeek);

            return $m + [
                'week' => $week,
                'due_date' => $startDate->copy()->addDays($week * 7 - 1)->toDateString(),
            ];
        })->all();
    }

    /** Saved progress of one module from the student's enrolled_courses JSON. */
    protected function moduleProgress(Student $student, string $slug, int $moduleIndex): array
    {
        $course = collect($student->enrolled_courses ?? [])
            ->first(fn ($c) => isset($c['course_id']) && ($c['course_id'] === $slug || $c['course_id'] === "AIXX-{$slug}"));

        $m = $course['modules_progress'][$moduleIndex] ?? $course['modules_progress'][(string) $moduleIndex] ?? [];

        return [
            'passed' => (bool) ($m['passed'] ?? false),
            'best_score' => $m['best_score'] ?? $m['score'] ?? null,
            'completed_at' => ($m['passed'] ?? false) ? ($m['completed_at'] ?? null) : null,
        ];
    }

    /** Stored plan merged with live progress, grouped into course steps. */
    protected function present(StudentRoadmap $roadmap, Student $student): array
    {
        $today = today();

        $modules = collect($roadmap->plan)->map(function ($m) use ($student, $today) {
            $progress = $this->moduleProgress($student, $m['course_slug'], $m['module_index']);
            $overdue = !$progress['passed'] && $m['due_date'] && Carbon::parse($m['due_date'])->lt($today);

            return $m + $progress + [
                'status' => $progress['passed'] ? 'completed' : ($overdue ? 'overdue' : 'pending'),
            ];
        });

        // The first unfinished module in path order is what the learner should study now.
        $next = $modules->first(fn ($m) => $m['status'] !== 'completed');
        if ($next) {
            $modules = $modules->map(fn ($m) => $m['course_slug'] === $next['course_slug'] && $m['module_index'] === $next['module_index'] && $m['status'] === 'pending'
                ? array_merge($m, ['status' => 'current'])
                : $m);
        }

        $steps = $modules->groupBy('step')->map(function (Collection $ms) {
            $first = $ms->first();
            $done = $ms->where('status', 'completed')->count();
            return [
                'step' => $first['step'],
                'course' => ['id' => $first['training_id'], 'name' => $first['course_name'], 'slug' => $first['course_slug']],
                'status' => $done === $ms->count() ? 'completed' : ($done > 0 || $ms->contains('status', 'current') ? 'in_progress' : 'not_started'),
                'completed_modules' => $done,
                'total_modules' => $ms->count(),
                'modules' => $ms->map(fn ($m) => [
                    'module_index' => $m['module_index'],
                    'title' => $m['title'],
                    'status' => $m['status'],
                    'week' => $m['week'],
                    'due_date' => $m['due_date'],
                    'best_score' => $m['best_score'],
                    'completed_at' => $m['completed_at'],
                ])->values(),
            ];
        })->values();

        $total = $modules->count();
        $completed = $modules->where('status', 'completed')->count();
        $overdue = $modules->where('status', 'overdue')->count();
        $totalWeeks = (int) $modules->max('week');

        return [
            'destination' => [
                'id' => $roadmap->learningPath->id,
                'name' => $roadmap->learningPath->name,
                'slug' => $roadmap->learningPath->slug,
                'description' => $roadmap->learningPath->description,
            ],
            'destination_query' => $roadmap->destination_query,
            'load' => [
                'hours_per_week' => $roadmap->hours_per_week,
                'module_hours' => self::MODULE_HOURS,
                'modules_per_week' => round($roadmap->hours_per_week / self::MODULE_HOURS, 2),
            ],
            'start_date' => $roadmap->start_date->toDateString(),
            'total_weeks' => $totalWeeks,
            'estimated_completion_date' => $totalWeeks > 0
                ? $roadmap->start_date->copy()->addDays($totalWeeks * 7 - 1)->toDateString()
                : null,
            'progress' => [
                'total_modules' => $total,
                'completed_modules' => $completed,
                'percent' => $total > 0 ? (int) round($completed * 100 / $total) : 0,
                'overdue_modules' => $overdue,
                'on_track' => $overdue === 0,
            ],
            'next' => $next ? [
                'course_slug' => $next['course_slug'],
                'course_name' => $next['course_name'],
                'module_index' => $next['module_index'],
                'title' => $next['title'],
                'due_date' => $next['due_date'],
            ] : null,
            'steps' => $steps,
        ];
    }
}

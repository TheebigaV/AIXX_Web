<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CourseController as WebCourseController;
use App\Models\LearningPath;
use App\Models\Training;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function __construct(protected WebCourseController $webCourses)
    {
    }

    /**
     * GET /api/courses — List available courses.
     * Reuses the same course catalog logic as the web app.
     */
    public function index(Request $request): JsonResponse
    {
        return $this->webCourses->hub($request);
    }

    /**
     * GET /api/courses/{id} — Get single course details.
     */
    public function show(string $id, Request $request): JsonResponse
    {
        return $this->webCourses->show($id, $request);
    }

    /**
     * GET /api/learning-paths — List learning paths.
     */
    public function learningPaths(): JsonResponse
    {
        $paths = LearningPath::where('is_active', true)
            ->with('trainings:id,name,slug,domestic_fee,international_fee')
            ->get()
            ->map(fn (LearningPath $path) => $this->formatLearningPath($path, false));

        return response()->json([
            'success' => true,
            'count' => $paths->count(),
            'data' => $paths,
        ], 200);
    }

    /**
     * GET /api/learning-paths/{id} — Get single learning path.
     */
    public function showLearningPath(string $id): JsonResponse
    {
        $path = LearningPath::where('id', is_numeric($id) ? (int) $id : 0)
            ->orWhere('slug', $id)
            ->with('trainings')
            ->first();

        if (!$path) {
            return response()->json(['success' => false, 'message' => 'Learning path not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatLearningPath($path, true),
        ], 200);
    }

    /**
     * GET /api/me/module-results — Module quiz results across the student's courses.
     * Optional ?course={slug} filter. Only modules with at least one attempt are listed.
     */
    public function moduleResults(Request $request): JsonResponse
    {
        $courseFilter = $request->query('course');
        $courses = collect($request->user()->enrolled_courses ?? [])
            ->filter(fn ($c) => isset($c['course_id']))
            ->map(function ($c) {
                $c['slug'] = Str::startsWith($c['course_id'], 'AIXX-') ? Str::after($c['course_id'], 'AIXX-') : $c['course_id'];
                return $c;
            })
            ->when($courseFilter, fn ($cs) => $cs->where('slug', $courseFilter));

        $trainings = Training::whereIn('slug', $courses->pluck('slug'))
            ->with('modules:id,training_id,module_index,title')
            ->get(['id', 'name', 'slug'])
            ->keyBy('slug');

        $results = $courses->flatMap(function ($c) use ($trainings) {
            $training = $trainings->get($c['slug']);

            return collect($c['modules_progress'] ?? [])
                ->filter(fn ($m) => ($m['score'] ?? null) !== null)
                ->map(function ($m, $index) use ($c, $training) {
                    $bestScore = $m['best_score'] ?? $m['score'];

                    return [
                        'course' => $training?->name ?? ($c['title'] ?? null),
                        'course_slug' => $c['slug'],
                        'module_index' => (int) $index,
                        'module_title' => $training?->modules->firstWhere('module_index', (int) $index)?->title,
                        'best_score' => $bestScore,
                        'last_score' => $m['last_score'] ?? $m['score'],
                        'passed' => (bool) ($m['passed'] ?? false),
                        'attempts' => $m['attempts'] ?? 1,
                        'completed_at' => ($m['passed'] ?? false) ? ($m['completed_at'] ?? null) : null,
                        'last_attempted_at' => $m['last_attempted_at'] ?? ($m['completed_at'] ?? null),
                    ];
                })
                ->sortBy('module_index')
                ->values();
        })->values();

        return response()->json(['success' => true, 'count' => $results->count(), 'data' => $results], 200);
    }

    protected function formatLearningPath(LearningPath $path, bool $detailed): array
    {
        return [
            'id' => $path->id,
            'name' => $path->name,
            'slug' => $path->slug,
            'description' => $path->description,
            'courses_count' => $path->trainings->count(),
            'courses' => $path->trainings->map(function ($t) use ($detailed) {
                $base = [
                    'id' => $t->id,
                    'name' => $t->name,
                    'slug' => $t->slug,
                ];

                if ($detailed) {
                    $base['domestic_fee'] = $t->domestic_fee;
                    $base['international_fee'] = $t->international_fee;
                    $base['description'] = $t->description;
                }

                return $base;
            })->values(),
        ];
    }
}

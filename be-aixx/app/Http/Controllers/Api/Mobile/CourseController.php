<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CourseController as WebCourseController;
use App\Models\LearningPath;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

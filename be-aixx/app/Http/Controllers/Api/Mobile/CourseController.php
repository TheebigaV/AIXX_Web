<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CourseController as WebCourseController;
use App\Models\LearningPath;
use App\Models\Training;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function __construct(protected WebCourseController $webCourses)
    {
    }

    /** Training types that are actual learnable courses (excludes seminars, workshops, newsletters, media_gallery). */
    protected const COURSE_TYPES = ['courses', 'elearning', 'free_courses', 'certification'];

    /**
     * GET /api/courses — List available courses.
     * Reuses the same course catalog logic as the web app.
     * Optional ?type= filter (comma-separated, or "all"); defaults to COURSE_TYPES.
     */
    public function index(Request $request): JsonResponse
    {
        $response = $this->webCourses->hub($request);
        $payload = $response->getData(true);

        $typeParam = trim((string) $request->query('type', ''));
        $types = $typeParam === ''
            ? self::COURSE_TYPES
            : array_filter(array_map('trim', explode(',', $typeParam)));

        $courses = collect($payload['data'] ?? [])
            ->when(!in_array('all', $types, true), fn ($cs) => $cs->filter(fn ($c) => in_array($c['type'] ?? 'courses', $types, true)))
            ->map(function ($c) {
                $c['highlights'] = $this->cleanHighlights($c['highlights'] ?? []);
                $c['thumbnail_url'] = $this->absoluteUrl($c['thumbnail_url'] ?? null);
                return $c;
            })
            ->values();

        $payload['count'] = $courses->count();
        $payload['data'] = $courses;

        return response()->json($payload, $response->status());
    }

    /**
     * GET /api/courses/{slug} — Get single course details (slug or numeric id).
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $response = $this->webCourses->show($slug, $request);
        $payload = $response->getData(true);

        if (isset($payload['data'])) {
            $payload['data']['highlights'] = $this->cleanHighlights($payload['data']['highlights'] ?? []);
            if (array_key_exists('thumbnail_url', $payload['data'])) {
                $payload['data']['thumbnail_url'] = $this->absoluteUrl($payload['data']['thumbnail_url']);
            }
        }

        return response()->json($payload, $response->status());
    }

    /**
     * GET /api/courses/{slug}/modules/{moduleIndex} — Module study notes and MCQs.
     * Keeps placeholder module titles in sync with /contents and strips the
     * "Question N:" / "Option X:" prefixes the app renders itself.
     */
    public function getModule(string $slug, int $moduleIndex, Request $request): JsonResponse
    {
        $response = $this->webCourses->getModule($slug, $moduleIndex, $request);
        $payload = $response->getData(true);

        $training = Training::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
            ->first();
        $hasDbModule = $training && $training->modules()->where('module_index', $moduleIndex)->exists();

        $oldTitle = $payload['title'] ?? '';
        if (!$hasDbModule) {
            $default = collect($this->webCourses->generateDefault5ModulesStructure($payload['course_name'] ?? ''))
                ->firstWhere('module_index', $moduleIndex);
            if ($default) {
                $payload['title'] = $default['title'];
            }
        }

        $payload['questions'] = collect($payload['questions'] ?? [])->map(function ($q) use ($oldTitle, $payload) {
            $text = preg_replace('/^\s*Question\s+\d+\s*:\s*/i', '', (string) ($q['question'] ?? ''));
            $q['question'] = $oldTitle !== '' ? str_replace($oldTitle, $payload['title'], $text) : $text;
            $q['options'] = collect($q['options'] ?? [])
                ->map(fn ($opt) => is_string($opt) ? preg_replace('/^\s*Option\s+[A-F]\s*[:.)]\s*/i', '', $opt) : $opt)
                ->all();
            return $q;
        })->values();

        return response()->json($payload, $response->status());
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

    /** Split-safe highlights: drop stray \r / whitespace and empty lines. */
    protected function cleanHighlights(array $highlights): array
    {
        return collect($highlights)
            ->map(fn ($h) => trim((string) $h))
            ->filter(fn ($h) => $h !== '')
            ->values()
            ->all();
    }

    /** Turn stored thumbnail paths ("/storage/x.png" or "trainings/x.png") into absolute URLs. */
    protected function absoluteUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }
        if (Str::startsWith($path, '/')) {
            return url($path);
        }

        return Storage::disk('public')->url($path);
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

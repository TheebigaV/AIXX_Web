<?php

namespace App\Services;

use App\Models\CertificationAttempt;
use App\Models\CourseProfile;
use App\Models\ModuleContent;
use App\Models\PathwayLevel;
use App\Models\Student;
use App\Models\Training;
use App\Models\TrainingModule;
use Illuminate\Support\Collection;

/**
 * Read-side helpers shared by the curriculum, certification and learner-profile
 * mobile endpoints. Module quiz progress lives in students.enrolled_courses
 * (written by the existing submit-quiz endpoint); this class only reads it.
 */
class LearnerProgressService
{
    public const STRENGTH = 80;
    public const DEVELOPING = 60;

    public function findCourse(string $slug): ?Training
    {
        return Training::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int) $slug : 0)
            ->first();
    }

    public function findModule(Training $training, int $moduleIndex): ?TrainingModule
    {
        return $training->modules()->where('is_published', true)->where('module_index', $moduleIndex)->first();
    }

    /** Content in the requested language, falling back to English. */
    public function localized(Collection $rows, ?string $lang)
    {
        return $rows->firstWhere('lang', $lang ?: 'en') ?? $rows->firstWhere('lang', 'en') ?? $rows->first();
    }

    public function courseProfile(Training $training, ?string $lang = null): ?CourseProfile
    {
        return $this->localized($training->profiles()->get(), $lang);
    }

    /** Saved quiz progress of one module from enrolled_courses. */
    public function moduleProgress(Student $student, string $slug, int $moduleIndex): array
    {
        $m = $this->courseEntry($student, $slug)['modules_progress'][$moduleIndex] ?? [];

        return [
            'passed' => (bool) ($m['passed'] ?? false),
            'best_score' => $m['best_score'] ?? $m['score'] ?? null,
            'attempts' => $m['attempts'] ?? (isset($m['score']) ? 1 : 0),
            'completed_at' => ($m['passed'] ?? false) ? ($m['completed_at'] ?? null) : null,
            'last_attempted_at' => $m['last_attempted_at'] ?? null,
        ];
    }

    public function courseEntry(Student $student, string $slug): ?array
    {
        return collect($student->enrolled_courses ?? [])
            ->first(fn ($c) => isset($c['course_id']) && ($c['course_id'] === $slug || $c['course_id'] === "AIXX-{$slug}"));
    }

    /** Published modules with each one's progress for the student. */
    public function modulesWithProgress(Training $training, ?Student $student): Collection
    {
        return $training->modules()->where('is_published', true)->get()->map(fn (TrainingModule $m) => [
            'module' => $m,
            'progress' => $student ? $this->moduleProgress($student, $training->slug, $m->module_index) : null,
        ]);
    }

    public function allModulesPassed(Training $training, Student $student): bool
    {
        $modules = $this->modulesWithProgress($training, $student);
        return $modules->isNotEmpty() && $modules->every(fn ($m) => $m['progress']['passed']);
    }

    public function passedCertification(Training $training, Student $student): ?CertificationAttempt
    {
        return CertificationAttempt::where('student_id', $student->id)
            ->where('training_id', $training->id)
            ->where('status', 'completed')
            ->where('passed', true)
            ->orderBy('completed_at')
            ->first();
    }

    /** Courses that carry structured curriculum content (a course profile). */
    public function curriculumCourses(): Collection
    {
        return Training::whereHas('profiles')->with('pathwayLevel')->get();
    }

    /** Curriculum courses the student has started (quiz progress or a certification attempt). */
    public function startedCurriculumCourses(Student $student): Collection
    {
        $attempted = CertificationAttempt::where('student_id', $student->id)->pluck('training_id')->all();

        return $this->curriculumCourses()
            ->filter(fn (Training $t) => $this->courseEntry($student, $t->slug) !== null || in_array($t->id, $attempted, true))
            ->values();
    }

    /**
     * Competency profile: each area's score averages the learner's best module
     * quiz scores and latest certification topic results mapped to that area.
     */
    public function competencyProfile(Student $student, Training $training, ?string $lang = null): array
    {
        $profile = $this->courseProfile($training, $lang);
        $areas = collect($profile?->competency_areas ?? []);

        $contents = ModuleContent::whereIn('training_module_id', $training->modules()->pluck('id'))->get();
        $moduleArea = $training->modules()->get()->mapWithKeys(function (TrainingModule $m) use ($contents, $lang) {
            $content = $this->localized($contents->where('training_module_id', $m->id), $lang);
            return [$m->module_index => $content?->competency_area];
        });

        $scores = [];
        foreach ($moduleArea as $index => $area) {
            $best = $this->moduleProgress($student, $training->slug, (int) $index)['best_score'];
            if ($area && $best !== null) {
                $scores[$area][] = (int) $best;
            }
        }

        $latest = CertificationAttempt::where('student_id', $student->id)
            ->where('training_id', $training->id)
            ->where('status', 'completed')
            ->latest('completed_at')
            ->first();
        foreach ($latest?->topic_results ?? [] as $topic) {
            $area = $moduleArea[$topic['module_index']] ?? null;
            if ($area && $topic['total'] > 0) {
                $scores[$area][] = (int) round($topic['correct'] * 100 / $topic['total']);
            }
        }

        $rows = $areas->map(function ($a) use ($scores) {
            $values = $scores[$a['area']] ?? [];
            $score = $values ? (int) round(array_sum($values) / count($values)) : null;
            return [
                'area' => $a['area'],
                'description' => $a['description'] ?? null,
                'score' => $score,
                'status' => $this->statusFor($score),
                'evidence_count' => count($values),
            ];
        })->values();

        $assessed = $rows->whereNotNull('score');

        return [
            'course' => ['id' => $training->id, 'name' => $training->name, 'slug' => $training->slug],
            'overall_score' => $assessed->isNotEmpty() ? (int) round($assessed->avg('score')) : null,
            'assessed_areas' => $assessed->count(),
            'total_areas' => $rows->count(),
            'strengths' => $rows->where('status', 'strength')->pluck('area')->values(),
            'development_areas' => $rows->where('status', 'development_needed')->pluck('area')->values(),
            'areas' => $rows,
        ];
    }

    public function statusFor(?int $score): string
    {
        return match (true) {
            $score === null => 'not_assessed',
            $score >= self::STRENGTH => 'strength',
            $score >= self::DEVELOPING => 'developing',
            default => 'development_needed',
        };
    }

    /** Ordered recommendations for one curriculum course. */
    public function nextStepsFor(Student $student, Training $training, ?string $lang = null): array
    {
        $steps = [];
        $modules = $this->modulesWithProgress($training, $student);
        $pending = $modules->first(fn ($m) => !$m['progress']['passed']);
        $course = ['id' => $training->id, 'name' => $training->name, 'slug' => $training->slug];

        if ($pending) {
            $steps[] = [
                'type' => 'continue_module',
                'title' => "Continue Module {$pending['module']->module_index}: {$pending['module']->title}",
                'course' => $course,
                'module_index' => $pending['module']->module_index,
                'url' => "/api/courses/{$training->slug}/modules/{$pending['module']->module_index}/lesson",
            ];
        } elseif (!$this->passedCertification($training, $student) && $training->blueprint()->exists()) {
            $steps[] = [
                'type' => 'certification',
                'title' => "Take the {$training->name} certification assessment",
                'course' => $course,
                'url' => "/api/courses/{$training->slug}/certification/attempts",
            ];
        } else {
            $steps = array_merge($steps, $this->nextLevelSteps($training));
        }

        $profile = $this->competencyProfile($student, $training, $lang);
        foreach (collect($profile['areas'])->where('status', 'development_needed') as $area) {
            $steps[] = [
                'type' => 'revise',
                'title' => "Revise {$area['area']}",
                'course' => $course,
                'competency_area' => $area['area'],
                'module_indexes' => $this->modulesForArea($training, $area['area']),
            ];
        }

        return $steps;
    }

    protected function nextLevelSteps(Training $training): array
    {
        $current = $training->pathwayLevel;
        if (!$current) {
            return [];
        }

        $next = PathwayLevel::where('pathway_slug', $current->pathway_slug)
            ->where('level', '>', $current->level)
            ->orderBy('level')
            ->with('training:id,name,slug')
            ->first();

        if (!$next) {
            return [['type' => 'pathway_complete', 'title' => "You have completed the {$current->pathway_name}"]];
        }

        return [[
            'type' => $next->training ? 'next_level' : 'next_level_coming_soon',
            'title' => "Next: {$next->level_name}",
            'description' => $next->description,
            'level' => $next->level,
            'course' => $next->training ? ['id' => $next->training->id, 'name' => $next->training->name, 'slug' => $next->training->slug] : null,
        ]];
    }

    public function modulesForArea(Training $training, string $area): array
    {
        $ids = ModuleContent::where('competency_area', $area)->pluck('training_module_id');

        return $training->modules()->whereIn('id', $ids)->orderBy('module_index')->pluck('module_index')->unique()->values()->all();
    }

    /** Badges earned from curriculum courses (computed, not stored). */
    public function badges(Student $student): Collection
    {
        return $this->startedCurriculumCourses($student)->flatMap(function (Training $t) use ($student) {
            $badges = [];
            $modules = $this->modulesWithProgress($t, $student);

            if ($modules->isNotEmpty() && $modules->every(fn ($m) => $m['progress']['passed'])) {
                $badges[] = [
                    'code' => "modules-complete-{$t->slug}",
                    'name' => "All {$t->name} modules complete",
                    'course' => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug],
                    'awarded_at' => $modules->pluck('progress.completed_at')->filter()->max(),
                ];
            }

            if ($cert = $this->passedCertification($t, $student)) {
                $label = $t->pathwayLevel?->level_name ?? $t->name;
                $badges[] = [
                    'code' => "certified-{$t->slug}",
                    'name' => "{$label} Complete",
                    'course' => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug],
                    'awarded_at' => $cert->completed_at?->toIso8601String(),
                ];
            }

            return $badges;
        })->values();
    }
}

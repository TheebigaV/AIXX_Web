<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\CertificateAttempt;
use App\Models\CertificationAttempt;
use App\Models\PathwayLevel;
use App\Models\Student;
use App\Models\Training;
use App\Services\LearnerProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Learner-facing outputs of the curriculum: competency profile, recommended
 * next steps, badges and the Aviation Career Passport.
 */
class LearnerProfileController extends Controller
{
    public const QUALIFICATION_REMINDER = 'Course completion builds foundation knowledge only. Live operational work still requires employer-specific training, approved data, supervised competency assessment and authorisation.';

    public function __construct(protected LearnerProgressService $progress)
    {
    }

    /** GET /api/me/competency-profile?course={slug}&lang= */
    public function competencyProfile(Request $request): JsonResponse
    {
        /** @var Student $student */
        $student = $request->user();
        $courses = $this->courses($request, $student);

        if ($courses === null) {
            return response()->json(['success' => false, 'message' => 'No structured curriculum for this course.'], 404);
        }

        $data = $courses->map(fn (Training $t) => $this->progress->competencyProfile($student, $t, $request->query('lang')))->values();

        return response()->json(['success' => true, 'count' => $data->count(), 'data' => $data]);
    }

    /** GET /api/me/next-steps?course={slug} */
    public function nextSteps(Request $request): JsonResponse
    {
        /** @var Student $student */
        $student = $request->user();
        $courses = $this->courses($request, $student);

        if ($courses === null) {
            return response()->json(['success' => false, 'message' => 'No structured curriculum for this course.'], 404);
        }

        $steps = $courses->flatMap(fn (Training $t) => $this->progress->nextStepsFor($student, $t, $request->query('lang')))->values();

        // Nothing started yet: suggest the first level of every pathway.
        if ($courses->isEmpty()) {
            $steps = PathwayLevel::where('level', 1)->whereNotNull('training_id')->with('training:id,name,slug')->get()
                ->map(fn (PathwayLevel $l) => [
                    'type' => 'start_course',
                    'title' => "Start {$l->level_name}",
                    'description' => $l->pathway_name,
                    'course' => ['id' => $l->training->id, 'name' => $l->training->name, 'slug' => $l->training->slug],
                    'url' => "/api/courses/{$l->training->slug}/curriculum",
                ])->values();
        }

        return response()->json([
            'success' => true,
            'count' => $steps->count(),
            'data' => $steps,
            'reminder' => self::QUALIFICATION_REMINDER,
        ]);
    }

    /** GET /api/me/badges */
    public function badges(Request $request): JsonResponse
    {
        $badges = $this->progress->badges($request->user());

        return response()->json(['success' => true, 'count' => $badges->count(), 'data' => $badges]);
    }

    /**
     * GET /api/me/career-passport — Completed modules, assessment history, competency indicators,
     * badges, certificates, pathway position and next recommended learning in one view.
     */
    public function careerPassport(Request $request): JsonResponse
    {
        /** @var Student $student */
        $student = $request->user();
        $lang = $request->query('lang');
        $courses = $this->progress->startedCurriculumCourses($student);

        $pathways = PathwayLevel::with('training:id,name,slug')->orderBy('pathway_slug')->orderBy('level')->get()
            ->groupBy('pathway_slug')
            ->map(function ($levels) use ($student) {
                return [
                    'slug' => $levels->first()->pathway_slug,
                    'name' => $levels->first()->pathway_name,
                    'levels' => $levels->map(function (PathwayLevel $l) use ($student) {
                        $status = 'not_started';
                        if (!$l->training) {
                            $status = 'coming_soon';
                        } elseif ($this->progress->passedCertification($l->training, $student)) {
                            $status = 'certified';
                        } elseif ($this->progress->courseEntry($student, $l->training->slug)) {
                            $status = 'in_progress';
                        }
                        return [
                            'level' => $l->level,
                            'level_name' => $l->level_name,
                            'status' => $status,
                            'course' => $l->training ? ['id' => $l->training->id, 'name' => $l->training->name, 'slug' => $l->training->slug] : null,
                        ];
                    })->values(),
                ];
            })->values();

        $completedModules = $courses->flatMap(fn (Training $t) => $this->progress->modulesWithProgress($t, $student)
            ->filter(fn ($m) => $m['progress']['passed'])
            ->map(fn ($m) => [
                'course_slug' => $t->slug,
                'course_name' => $t->name,
                'module_index' => $m['module']->module_index,
                'title' => $m['module']->title,
                'best_score' => $m['progress']['best_score'],
                'completed_at' => $m['progress']['completed_at'],
            ]))->values();

        $assessments = CertificationAttempt::where('student_id', $student->id)->where('status', 'completed')
            ->with('training:id,name,slug')->latest('completed_at')->get()
            ->map(fn (CertificationAttempt $a) => [
                'id' => $a->id,
                'type' => 'certification',
                'course' => ['id' => $a->training->id, 'name' => $a->training->name, 'slug' => $a->training->slug],
                'score' => $a->score,
                'passed' => $a->passed,
                'completed_at' => $a->completed_at?->toIso8601String(),
            ])->values();

        $certificates = CertificateAttempt::where('student_id', $student->id)->where('passed', true)->whereNull('revoked_at')
            ->with('training:id,name,slug')->latest('issued_at')->get()
            ->map(fn (CertificateAttempt $c) => [
                'id' => $c->id,
                'course' => $c->training ? ['id' => $c->training->id, 'name' => $c->training->name, 'slug' => $c->training->slug] : null,
                'score' => $c->score,
                'certificate_token' => $c->certificate_token,
                'issued_at' => $c->issued_at?->toIso8601String(),
                'verify_api_url' => "/api/certificate/verify/{$c->certificate_token}",
            ])->values();

        return response()->json(['success' => true, 'data' => [
            'learner' => [
                'id' => $student->id,
                'registration_id' => $student->registration_id,
                'full_name' => $student->full_name,
            ],
            'pathways' => $pathways,
            'completed_modules' => $completedModules,
            'assessment_history' => $assessments,
            'competency_profiles' => $courses->map(fn (Training $t) => $this->progress->competencyProfile($student, $t, $lang))->values(),
            'badges' => $this->progress->badges($student),
            'certificates' => $certificates,
            'next_steps' => $courses->flatMap(fn (Training $t) => $this->progress->nextStepsFor($student, $t, $lang))->values(),
            'reminder' => self::QUALIFICATION_REMINDER,
        ]]);
    }

    /** Requested curriculum course, or every curriculum course the learner has started. Null = unknown course. */
    protected function courses(Request $request, Student $student)
    {
        $slug = $request->query('course');
        if (!$slug) {
            return $this->progress->startedCurriculumCourses($student);
        }

        $training = $this->progress->findCourse($slug);
        return $training && $this->progress->courseProfile($training) ? collect([$training]) : null;
    }
}

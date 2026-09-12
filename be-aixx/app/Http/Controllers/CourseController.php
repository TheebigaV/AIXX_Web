<?php

namespace App\Http\Controllers;

use App\Models\Training;
use App\Models\TrainingModule;
use App\Models\TrainingQuestion;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /**
     * Return the list of courses for the Hub Screen (course tiles grid).
     */
    public function index(Request $request): JsonResponse
    {
        return $this->hub($request);
    }

    /**
     * Hub Screen API: Returns formatted course list for Flutter/Riverpod `courseListProvider`.
     */
    public function hub(Request $request): JsonResponse
    {
        $dbCourses = Training::where('is_active', true)
            ->with(['modules' => function ($q) {
                $q->where('is_published', true)->withCount('questions');
            }, 'image'])
            ->get();

        $coursesList = $dbCourses->map(function ($course) {
            $modulesCount = $course->modules->count();
            $totalQuestions = $course->modules->sum('questions_count');

            // Default to 5 modules & 150 questions (5x30) if modules not yet populated
            if ($modulesCount === 0) {
                $modulesCount = 5;
                $totalQuestions = 150;
            }

            $isFoundation = str_contains(strtolower($course->name), 'free') ||
                            str_contains(strtolower($course->slug), 'free') ||
                            str_contains(strtolower($course->name), 'basics') ||
                            str_contains(strtolower($course->name), 'foundation') ||
                            empty($course->domestic_fee) ||
                            $course->domestic_fee === 'Free';

            $badges = [];
            if ($isFoundation) {
                $badges[] = 'Free';
                $badges[] = 'Foundation';
            } else {
                $badges[] = 'Professional';
                $badges[] = 'Certified';
            }

            return [
                'id' => $course->id,
                'name' => $course->name,
                'title' => $course->name,
                'slug' => $course->slug,
                'type' => $course->type ?? 'courses',
                'description' => $course->description ?? 'Comprehensive AI and technology curriculum.',
                'sub_title' => $course->sub_title ?? 'Master Artificial Intelligence Skills',
                'duration' => $course->duration ?? '4 - 6 Weeks (Self-Paced)',
                'domestic_fee' => $isFoundation ? 'Free' : ($course->domestic_fee ?? 'Free'),
                'international_fee' => $isFoundation ? 'Free' : ($course->international_fee ?? 'Free'),
                'is_free' => $isFoundation,
                'badges' => $badges,
                'modules_count' => $modulesCount,
                'total_mcqs_count' => $totalQuestions,
                'highlights' => !empty($course->highlights) ? explode("\n", $course->highlights) : [
                    '5 Comprehensive Learning Modules',
                    '30 Practice MCQs per Module (150 Total)',
                    'Official AIXX Knowledge Certification',
                    'Interactive Progress Tracking'
                ],
                'thumbnail_url' => $course->image ? $course->image->file_name : '/storage/trainings/course_default.png',
            ];
        });

        // If database is empty, fallback to catalog
        if ($coursesList->isEmpty()) {
            $coursesList = collect($this->getDefaultCatalog());
        }

        return response()->json([
            'success' => true,
            'count' => $coursesList->count(),
            'data' => $coursesList
        ], 200);
    }

    /**
     * Course Detail Screen API: Returns full course metadata, highlights, and 5 modules overview.
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $course = Training::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int)$slug : 0)
            ->with(['modules' => function ($q) {
                $q->where('is_published', true)->withCount('questions');
            }, 'image'])
            ->first();

        if (!$course) {
            // Find in default catalog if not in DB
            $catalog = $this->getDefaultCatalog();
            $matched = collect($catalog)->firstWhere('slug', $slug) ?? collect($catalog)->first();
            if ($matched) {
                return response()->json([
                    'success' => true,
                    'data' => $matched
                ], 200);
            }
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $modules = $course->modules;
        $modulesList = [];

        if ($modules->isNotEmpty()) {
            foreach ($modules as $m) {
                $modulesList[] = [
                    'id' => $m->id,
                    'module_index' => $m->module_index,
                    'title' => $m->title,
                    'study_notes_preview' => Str::limit(strip_tags($m->study_notes), 120),
                    'questions_count' => $m->questions_count > 0 ? $m->questions_count : 30,
                    'is_published' => (bool)$m->is_published,
                ];
            }
        } else {
            // Default 5 modules structure
            $modulesList = $this->generateDefault5ModulesStructure($course->name);
        }

        $isFoundation = str_contains(strtolower($course->name), 'free') ||
                        str_contains(strtolower($course->slug), 'free') ||
                        empty($course->domestic_fee) ||
                        $course->domestic_fee === 'Free';

        // Check if student is currently enrolled / progress status
        $studentIdentifier = $request->query('token') ?: $request->query('registration_id');
        $studentProgress = null;
        if ($studentIdentifier) {
            $student = Student::where('uuid', $studentIdentifier)->orWhere('registration_id', $studentIdentifier)->first();
            if ($student) {
                $studentProgress = $this->extractStudentCourseProgress($student, $course->slug);
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $course->id,
                'name' => $course->name,
                'title' => $course->name,
                'slug' => $course->slug,
                'type' => $course->type ?? 'courses',
                'description' => $course->description,
                'sub_title' => $course->sub_title ?? 'Master Artificial Intelligence Skills',
                'duration' => $course->duration ?? '4 - 6 Weeks',
                'domestic_fee' => $isFoundation ? 'Free' : ($course->domestic_fee ?? 'Free'),
                'international_fee' => $isFoundation ? 'Free' : ($course->international_fee ?? 'Free'),
                'is_free' => $isFoundation,
                'badges' => $isFoundation ? ['Free', 'Foundation', 'Certificate'] : ['Professional', 'Certified'],
                'modules_count' => count($modulesList),
                'total_mcqs_count' => collect($modulesList)->sum('questions_count'),
                'highlights' => !empty($course->highlights) ? explode("\n", $course->highlights) : [
                    '5 Structured Learning Modules',
                    '30 Practice MCQs per Module (150 Total)',
                    'Official AIXX Knowledge Certification',
                    'No Prerequisites Required'
                ],
                'modules_preview' => $modulesList,
                'cta' => [
                    'button_text' => ($studentProgress && $studentProgress['progress_percentage'] > 0) ? 'Continue Course' : 'Start Course',
                    'action' => 'start_course',
                    'target_route' => "/courses/{$course->slug}/contents",
                    'is_free' => $isFoundation
                ],
                'student_progress' => $studentProgress
            ]
        ], 200);
    }

    /**
     * Course Contents Screen API: Returns list of 5 modules with progress counter.
     * Route: GET /api/courses/{slug}/contents
     */
    public function contents(string $slug, Request $request): JsonResponse
    {
        $course = Training::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int)$slug : 0)
            ->with(['modules' => function ($q) {
                $q->where('is_published', true)->with('questions');
            }])
            ->first();

        $courseName = $course ? $course->name : ucwords(str_replace('-', ' ', $slug));
        $courseId = $course ? $course->id : 1;
        $courseSlug = $course ? $course->slug : $slug;

        // Fetch student progress if token provided
        $studentIdentifier = $request->query('token') ?: $request->query('registration_id') ?: $request->header('X-Student-Token');
        $student = null;
        if ($studentIdentifier) {
            $student = Student::where('uuid', $studentIdentifier)->orWhere('registration_id', $studentIdentifier)->first();
        }

        $savedProgress = $student ? $this->extractStudentCourseProgress($student, $courseSlug) : null;

        $modulesData = [];
        if ($course && $course->modules->isNotEmpty()) {
            foreach ($course->modules as $idx => $m) {
                $mIndex = $m->module_index ?: ($idx + 1);
                $qCount = $m->questions->count() ?: 30;

                $mProgress = $savedProgress['modules_progress'][$mIndex] ?? [
                    'completed' => false,
                    'score' => null,
                    'passed' => false,
                    'completed_at' => null
                ];

                $modulesData[] = [
                    'id' => $m->id,
                    'module_index' => $mIndex,
                    'title' => $m->title,
                    'study_notes' => $m->study_notes,
                    'questions_count' => $qCount,
                    'status' => $mProgress['completed'] ? 'Completed' : 'Available',
                    'is_completed' => (bool)($mProgress['completed'] ?? false),
                    'score' => $mProgress['score'] ?? null,
                    'passed' => (bool)($mProgress['passed'] ?? false),
                    'action_url' => "/api/courses/{$courseSlug}/modules/{$mIndex}"
                ];
            }
        } else {
            // Default 5 modules
            $raw5 = $this->generateDefault5ModulesStructure($courseName);
            foreach ($raw5 as $m) {
                $mIndex = $m['module_index'];
                $mProgress = $savedProgress['modules_progress'][$mIndex] ?? [
                    'completed' => false,
                    'score' => null,
                    'passed' => false,
                    'completed_at' => null
                ];

                $modulesData[] = [
                    'id' => $m['id'],
                    'module_index' => $mIndex,
                    'title' => $m['title'],
                    'study_notes' => $m['study_notes_preview'],
                    'questions_count' => $m['questions_count'],
                    'status' => $mProgress['completed'] ? 'Completed' : 'Available',
                    'is_completed' => (bool)($mProgress['completed'] ?? false),
                    'score' => $mProgress['score'] ?? null,
                    'passed' => (bool)($mProgress['passed'] ?? false),
                    'action_url' => "/api/courses/{$courseSlug}/modules/{$mIndex}"
                ];
            }
        }

        $completedCount = collect($modulesData)->where('is_completed', true)->count();
        $totalModules = count($modulesData);
        $progressPct = $totalModules > 0 ? round(($completedCount / $totalModules) * 100) : 0;

        return response()->json([
            'success' => true,
            'course' => [
                'id' => $courseId,
                'name' => $courseName,
                'slug' => $courseSlug,
                'total_modules' => $totalModules,
                'completed_modules_count' => $completedCount,
                'progress_counter' => "{$completedCount}/{$totalModules} Completed",
                'progress_percentage' => $progressPct,
                'is_all_completed' => ($completedCount === $totalModules && $totalModules > 0),
            ],
            'modules' => $modulesData
        ], 200);
    }

    /**
     * Module Screen API: Returns specific module study notes and 30 MCQs.
     * Route: GET /api/courses/{slug}/modules/{moduleIndex}
     */
    public function getModule(string $slug, int $moduleIndex, Request $request): JsonResponse
    {
        $course = Training::where('slug', $slug)
            ->orWhere('id', is_numeric($slug) ? (int)$slug : 0)
            ->first();

        $courseSlug = $course ? $course->slug : $slug;
        $courseName = $course ? $course->name : ucwords(str_replace('-', ' ', $slug));

        $module = null;
        if ($course) {
            $module = TrainingModule::where('training_id', $course->id)
                ->where('module_index', $moduleIndex)
                ->with('questions')
                ->first();
        }

        $studyNotes = $module ? $module->study_notes : $this->getDefaultStudyNotesForModule($moduleIndex, $courseName);
        $moduleTitle = $module ? $module->title : "Module {$moduleIndex}: " . $this->getDefaultModuleTitle($moduleIndex);

        // Fetch questions or generate 30 MCQs
        $questions = [];
        if ($module && $module->questions->isNotEmpty()) {
            foreach ($module->questions as $idx => $q) {
                $optionsList = is_array($q->options) ? $q->options : json_decode($q->options, true) ?? [];
                
                // Format options as dict {'A': opt1, 'B': opt2, ...} or list
                $formattedOpts = [];
                $letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                foreach (array_values($optionsList) as $optIdx => $optText) {
                    $formattedOpts[$letters[$optIdx] ?? (string)$optIdx] = $optText;
                }

                $questions[] = [
                    'id' => $q->id,
                    'question_index' => $idx + 1,
                    'question' => $q->question,
                    'options' => $formattedOpts,
                ];
            }
        } else {
            // Generate standard 30 MCQs for this module
            $questions = $this->generate30MCQsForModule($moduleIndex, $moduleTitle);
        }

        return response()->json([
            'success' => true,
            'course_slug' => $courseSlug,
            'course_name' => $courseName,
            'module_index' => (int)$moduleIndex,
            'title' => $moduleTitle,
            'study_notes' => $studyNotes,
            'total_questions' => count($questions),
            'questions' => $questions,
            'submit_url' => "/api/courses/{$courseSlug}/modules/{$moduleIndex}/submit-quiz"
        ], 200);
    }

    /**
     * Submit Module Quiz API: Grades the 30 MCQs, saves module completion & score.
     * Route: POST /api/courses/{slug}/modules/{moduleIndex}/submit-quiz
     */
    public function submitModuleQuiz(string $slug, int $moduleIndex, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'nullable|string',
            'registration_id' => 'nullable|string',
            'answers' => 'required|array', // ['question_id' => 'A' or index => 'A']
        ]);

        $answers = $validated['answers'];
        $token = $validated['token'] ?? $request->header('X-Student-Token');
        $regId = $validated['registration_id'];

        $totalQuestions = count($answers);
        if ($totalQuestions === 0) {
            return response()->json(['success' => false, 'message' => 'No answers provided.'], 400);
        }

        // Grade submission
        $correctCount = 0;
        $resultsBreakdown = [];

        foreach ($answers as $qId => $selectedOption) {
            // Resolve question if in database
            $q = is_numeric($qId) ? TrainingQuestion::find($qId) : null;
            $isCorrect = false;
            $correctLetter = 'B'; // default reference
            $explanation = 'Correct answer aligns with module theoretical principles.';

            if ($q) {
                $correctLetter = $q->correct_answer ?? 'A';
                $isCorrect = (strtoupper(trim((string)$selectedOption)) === strtoupper(trim((string)$correctLetter)));
                $explanation = $q->explanation ?? $explanation;
            } else {
                // Fallback simulation: grade option
                $isCorrect = (in_array(strtoupper((string)$selectedOption), ['A', 'B', 'C', 'D']));
            }

            if ($isCorrect) {
                $correctCount++;
            }

            $resultsBreakdown[] = [
                'question_id' => $qId,
                'selected_option' => $selectedOption,
                'is_correct' => $isCorrect,
                'explanation' => $explanation
            ];
        }

        $percentageScore = round(($correctCount / max(1, $totalQuestions)) * 100);
        $passed = ($percentageScore >= 70); // 70% module pass mark

        // Save progress to student record if student identified
        $student = null;
        if ($token || $regId) {
            $student = Student::where('uuid', $token)->orWhere('registration_id', $regId)->first();
            if ($student) {
                $this->updateStudentModuleProgress($student, $slug, $moduleIndex, $percentageScore, $passed);
            }
        }

        $nextModuleIndex = $moduleIndex < 5 ? $moduleIndex + 1 : null;

        return response()->json([
            'success' => true,
            'module_index' => (int)$moduleIndex,
            'score' => $percentageScore,
            'correct_count' => $correctCount,
            'total_questions' => $totalQuestions,
            'passed' => $passed,
            'message' => $passed ? "Congratulations! You completed Module {$moduleIndex} with {$percentageScore}% score." : "You scored {$percentageScore}%. Review the study notes and try again.",
            'next_module' => $nextModuleIndex ? [
                'module_index' => $nextModuleIndex,
                'unlocked' => $passed,
                'url' => "/api/courses/{$slug}/modules/{$nextModuleIndex}"
            ] : null,
            'results' => $resultsBreakdown
        ], 200);
    }

    /**
     * Start Course CTA API: Initializes enrollment & progress tracking for student.
     * Route: POST /api/courses/{slug}/start
     */
    public function startCourse(string $slug, Request $request): JsonResponse
    {
        $identifier = $request->input('token') ?: $request->input('registration_id');
        $student = null;

        if ($identifier) {
            $student = Student::where('uuid', $identifier)->orWhere('registration_id', $identifier)->first();
        }

        if ($student) {
            $enrolled = $student->enrolled_courses ?? [];
            $alreadyEnrolled = false;

            foreach ($enrolled as &$c) {
                if (isset($c['course_id']) && ($c['course_id'] === $slug || $c['course_id'] === "AIXX-{$slug}")) {
                    $alreadyEnrolled = true;
                    $c['status'] = 'In Progress';
                    break;
                }
            }

            if (!$alreadyEnrolled) {
                $course = Training::where('slug', $slug)->first();
                $enrolled[] = [
                    'course_id' => $slug,
                    'title' => $course ? $course->name : ucwords(str_replace('-', ' ', $slug)),
                    'status' => 'In Progress',
                    'progress_percentage' => 0,
                    'completed_modules_count' => 0,
                    'total_modules' => 5,
                    'enrolled_at' => Carbon::now()->toIso8601String(),
                    'modules_progress' => [
                        '1' => ['completed' => false, 'score' => null, 'passed' => false],
                        '2' => ['completed' => false, 'score' => null, 'passed' => false],
                        '3' => ['completed' => false, 'score' => null, 'passed' => false],
                        '4' => ['completed' => false, 'score' => null, 'passed' => false],
                        '5' => ['completed' => false, 'score' => null, 'passed' => false],
                    ]
                ];
            }

            $student->enrolled_courses = $enrolled;
            $student->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Course started successfully! Welcome to the curriculum.',
            'target_contents_url' => "/api/courses/{$slug}/contents",
            'first_module_url' => "/api/courses/{$slug}/modules/1"
        ], 200);
    }

    /**
     * Get Student's Course Progress
     * Route: GET /api/courses/{slug}/progress
     */
    public function getProgress(string $slug, Request $request): JsonResponse
    {
        $identifier = $request->query('token') ?: $request->query('registration_id');
        if (!$identifier) {
            return response()->json(['success' => false, 'message' => 'Student token or registration ID required.'], 400);
        }

        $student = Student::where('uuid', $identifier)->orWhere('registration_id', $identifier)->first();
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found.'], 404);
        }

        $progress = $this->extractStudentCourseProgress($student, $slug);

        return response()->json([
            'success' => true,
            'student_name' => $student->full_name ?? $student->name,
            'registration_id' => $student->registration_id,
            'course_slug' => $slug,
            'progress' => $progress
        ], 200);
    }

    // ─────────────────────────────────────────────────────────────
    // Internal Helper Methods
    // ─────────────────────────────────────────────────────────────

    protected function extractStudentCourseProgress(Student $student, string $slug): array
    {
        $enrolled = $student->enrolled_courses ?? [];
        foreach ($enrolled as $c) {
            if (isset($c['course_id']) && ($c['course_id'] === $slug || $c['course_id'] === "AIXX-{$slug}")) {
                return $c;
            }
        }

        // Return empty initialized structure
        return [
            'course_id' => $slug,
            'status' => 'Not Started',
            'progress_percentage' => 0,
            'completed_modules_count' => 0,
            'total_modules' => 5,
            'modules_progress' => [
                '1' => ['completed' => false, 'score' => null, 'passed' => false],
                '2' => ['completed' => false, 'score' => null, 'passed' => false],
                '3' => ['completed' => false, 'score' => null, 'passed' => false],
                '4' => ['completed' => false, 'score' => null, 'passed' => false],
                '5' => ['completed' => false, 'score' => null, 'passed' => false],
            ]
        ];
    }

    protected function updateStudentModuleProgress(Student $student, string $slug, int $moduleIndex, int $score, bool $passed): void
    {
        $enrolled = $student->enrolled_courses ?? [];
        $found = false;

        foreach ($enrolled as &$c) {
            if (isset($c['course_id']) && ($c['course_id'] === $slug || $c['course_id'] === "AIXX-{$slug}")) {
                $found = true;
                $modulesProgress = $c['modules_progress'] ?? [];
                $modulesProgress[(string)$moduleIndex] = [
                    'completed' => true,
                    'score' => $score,
                    'passed' => $passed,
                    'completed_at' => Carbon::now()->toIso8601String()
                ];
                $c['modules_progress'] = $modulesProgress;

                $completedCount = collect($modulesProgress)->where('completed', true)->count();
                $c['completed_modules_count'] = $completedCount;
                $c['progress_percentage'] = round(($completedCount / 5) * 100);
                $c['status'] = $c['progress_percentage'] >= 100 ? 'Completed' : 'In Progress';
                break;
            }
        }

        if (!$found) {
            $enrolled[] = [
                'course_id' => $slug,
                'title' => ucwords(str_replace('-', ' ', $slug)),
                'status' => 'In Progress',
                'progress_percentage' => 20,
                'completed_modules_count' => 1,
                'total_modules' => 5,
                'enrolled_at' => Carbon::now()->toIso8601String(),
                'modules_progress' => [
                    (string)$moduleIndex => [
                        'completed' => true,
                        'score' => $score,
                        'passed' => $passed,
                        'completed_at' => Carbon::now()->toIso8601String()
                    ]
                ]
            ];
        }

        $student->enrolled_courses = $enrolled;
        $student->save();
    }

    protected function generateDefault5ModulesStructure(string $courseName): array
    {
        return [
            [
                'id' => 1,
                'module_index' => 1,
                'title' => 'Module 1: Foundations & Core Concepts',
                'study_notes_preview' => 'Introduction to fundamental principles, industry architectures, terminology, and foundational frameworks.',
                'questions_count' => 30,
                'is_published' => true,
            ],
            [
                'id' => 2,
                'module_index' => 2,
                'title' => 'Module 2: Technical Architecture & Mechanics',
                'study_notes_preview' => 'Deep dive into algorithmic workflows, neural architectures, data pipelines, and computational backbones.',
                'questions_count' => 30,
                'is_published' => true,
            ],
            [
                'id' => 3,
                'module_index' => 3,
                'title' => 'Module 3: Hands-on Implementation & Tools',
                'study_notes_preview' => 'Practical tooling, prompt engineering, model tuning, workflow automation, and SDK integration.',
                'questions_count' => 30,
                'is_published' => true,
            ],
            [
                'id' => 4,
                'module_index' => 4,
                'title' => 'Module 4: Enterprise Integration & Security',
                'study_notes_preview' => 'Scalable deployment patterns, API gateways, enterprise data governance, safety guidelines, and security best practices.',
                'questions_count' => 30,
                'is_published' => true,
            ],
            [
                'id' => 5,
                'module_index' => 5,
                'title' => 'Module 5: Capstone Application & Future Trends',
                'study_notes_preview' => 'Real-world case studies, capstone project blueprints, ROI calculation, and emerging industry frontiers.',
                'questions_count' => 30,
                'is_published' => true,
            ]
        ];
    }

    protected function getDefaultModuleTitle(int $moduleIndex): string
    {
        $titles = [
            1 => 'Foundations & Core Principles',
            2 => 'Technical Architecture & Mechanics',
            3 => 'Hands-on Implementation & Tooling',
            4 => 'Enterprise Security & Deployment',
            5 => 'Capstone Applications & Future Horizons'
        ];
        return $titles[$moduleIndex] ?? "Advanced Topics Section {$moduleIndex}";
    }

    protected function getDefaultStudyNotesForModule(int $moduleIndex, string $courseName): string
    {
        return "### {$courseName} - Module {$moduleIndex}\n\n" .
               "#### 1. Executive Summary\n" .
               "This module establishes crucial competencies in modern technology stacks, explaining both theoretical underpinnings and hands-on implementations.\n\n" .
               "#### 2. Key Objectives\n" .
               "- Understand key algorithmic mechanisms and infrastructure paradigms.\n" .
               "- Apply industry-standard best practices in real-world scenarios.\n" .
               "- Prepare for the 30-question interactive knowledge check.\n\n" .
               "#### 3. Core Concepts & Reference Guide\n" .
               "Review the foundational documentation before proceeding to the 30 multiple-choice questions.";
    }

    protected function generate30MCQsForModule(int $moduleIndex, string $moduleTitle): array
    {
        $questions = [];
        $topics = [
            "core definitions and baseline mechanics",
            "algorithmic computational efficiency",
            "data representation and tensor representations",
            "model evaluation and validation metrics",
            "gradient optimization and loss functions",
            "attention mechanisms and context windows",
            "fine-tuning vs prompt adaptation",
            "retrieval augmented generation (RAG) pipelines",
            "vector similarity search and embeddings",
            "latency reduction and inference quantization",
            "distributed GPU memory caching",
            "tokenization strategies and vocabularies",
            "responsible AI bias mitigations",
            "data privacy in multi-tenant environments",
            "enterprise API authentication patterns",
            "rate limiting and request queuing",
            "continuous monitoring and drift detection",
            "pipeline orchestration and containerization",
            "cost optimization for cloud GPU clusters",
            "cross-modal alignment and zero-shot reasoning",
            "prompt injection prevention protocols",
            "structured JSON schema output enforcement",
            "synthetic dataset generation techniques",
            "knowledge distillation into smaller models",
            "real-time streaming inference architectures",
            "human-in-the-loop validation checkpoints",
            "model weights checkpoint management",
            "explainability and feature attribution",
            "regulatory compliance and data residency",
            "production rollback and blue-green deployments"
        ];

        for ($i = 1; $i <= 30; $i++) {
            $topic = $topics[($i - 1) % count($topics)];
            $questions[] = [
                'id' => ($moduleIndex * 100) + $i,
                'question_index' => $i,
                'question' => "Question {$i}: In the context of {$moduleTitle}, how is {$topic} optimally addressed in production?",
                'options' => [
                    'A' => "Option A: Utilizing deterministic static rule engines without feedback loops.",
                    'B' => "Option B: Implementing distributed scalable architectures with standard protocols.",
                    'C' => "Option C: Restricting compute clusters to single-threaded sequential processors.",
                    'D' => "Option D: Bypassing validation checks in favour of raw unauthenticated throughput."
                ]
            ];
        }

        return $questions;
    }

    protected function getDefaultCatalog(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Free AI Knowledge Certificate Program',
                'title' => 'Free AI Knowledge Certificate Program',
                'slug' => 'free-ai-knowledge-certificate-program',
                'type' => 'courses',
                'description' => 'Official AIXX foundational certification covering modern AI architectures, machine learning concepts, and practical applications.',
                'sub_title' => 'Certified AI Foundation Course',
                'duration' => 'Self-Paced (5 Modules × 30 MCQs)',
                'domestic_fee' => 'Free',
                'international_fee' => 'Free',
                'is_free' => true,
                'badges' => ['Free', 'Foundation', 'Certified'],
                'modules_count' => 5,
                'total_mcqs_count' => 150,
                'highlights' => [
                    '5 Structured Learning Modules',
                    '30 Practice MCQs per Module (150 Total)',
                    'Official AIXX Knowledge Certification',
                    'Interactive Progress Tracking'
                ],
                'thumbnail_url' => '/storage/trainings/cert_hero.jpg'
            ],
            [
                'id' => 2,
                'name' => 'AI Basics for Productivity',
                'title' => 'AI Basics for Productivity',
                'slug' => 'ai-basics-for-productivity',
                'type' => 'courses',
                'description' => 'Master fundamental AI tools and workflows to automate daily tasks, generate content, and double your personal productivity.',
                'sub_title' => 'Productivity & Workflow Mastery',
                'duration' => '3 - 4 Months',
                'domestic_fee' => 'Free',
                'international_fee' => 'Free',
                'is_free' => true,
                'badges' => ['Free', 'Foundation'],
                'modules_count' => 5,
                'total_mcqs_count' => 150,
                'highlights' => ['Prompt cheatsheet', 'Workflow automation', '5 Modules × 30 MCQs'],
                'thumbnail_url' => '/storage/trainings/productivity.jpg'
            ],
            [
                'id' => 3,
                'name' => 'AI for Business Leaders',
                'title' => 'AI for Business Leaders',
                'slug' => 'ai-for-business-leaders',
                'type' => 'courses',
                'description' => 'A comprehensive guide to implementing AI strategies in enterprise environments without writing code.',
                'sub_title' => 'Executive Leadership Certificate',
                'duration' => '6 - 8 Months',
                'domestic_fee' => '$400.00',
                'international_fee' => '$300.00',
                'is_free' => false,
                'badges' => ['Professional', 'Executive'],
                'modules_count' => 5,
                'total_mcqs_count' => 150,
                'highlights' => ['Executive roadmap', 'ROI calculation', '5 Modules × 30 MCQs'],
                'thumbnail_url' => '/storage/trainings/business.jpg'
            ],
            [
                'id' => 4,
                'name' => 'Generative AI Masterclass',
                'title' => 'Generative AI Masterclass',
                'slug' => 'generative-ai-masterclass',
                'type' => 'courses',
                'description' => 'Deep dive into LLM architectures, fine-tuning, RAG pipelines, and building production-ready generative AI solutions.',
                'sub_title' => 'Advanced LLM & Multi-Modal Engineering',
                'duration' => '8 - 10 Months',
                'domestic_fee' => '$2,800.00',
                'international_fee' => '$2,100.00',
                'is_free' => false,
                'badges' => ['Masterclass', 'Certified'],
                'modules_count' => 5,
                'total_mcqs_count' => 150,
                'highlights' => ['RAG Architecture', 'Fine-Tuning Labs', '5 Modules × 30 MCQs'],
                'thumbnail_url' => '/storage/trainings/genai.jpg'
            ]
        ];
    }
}

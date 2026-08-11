<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Notifications\CertificateTestLinkNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Models\CertificateQuestion;
use App\Models\CertificateAttempt;
use App\Models\CertificateAttemptQuestion;

class CertificateController extends Controller
{
    // The hardcoded questions array has been removed in favor of the dynamic database-driven system.

    /**
     * Register a candidate for the Free AI Certificate
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name'            => 'required|string|max:255',
            'gender'               => 'required|string|in:Male,Female,Other',
            'company_name'         => 'required|string|max:255',
            'academic_institution' => 'required|string|max:255',
            'phone'                => 'required|string|max:50',
            'email'                => 'required|email|max:255|unique:students,email',
            'country'              => 'required|string|max:255',
        ]);

        $uuid = (string) Str::uuid();

        $registration = Student::create([
            'uuid'                 => $uuid,
            'full_name'            => $validated['full_name'],
            'gender'               => $validated['gender'],
            'company_name'         => $validated['company_name'],
            'academic_institution' => $validated['academic_institution'],
            'phone'                => $validated['phone'],
            'email'                => $validated['email'],
            'country'              => $validated['country'],
            'password'             => '', // Password disabled per request
        ]);

        $registrationId = 'AIXX-REG-' . $registration->id;
        $registration->update([
            'registration_id' => $registrationId
        ]);

        return response()->json([
            'message'         => 'Registration successful!',
            'uuid'            => $uuid,
            'registration_id' => $registrationId,
        ], 201);
    }

    /**
     * Login candidate with Registration ID and Email
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'registration_id' => 'required|string',
            'email'           => 'nullable|email',
        ]);

        $regId = trim($validated['registration_id']);
        $email = !empty($validated['email']) ? trim($validated['email']) : null;

        $query = Student::where('registration_id', $regId);

        if ($email) {
            $query->where('email', $email);
        }

        $candidate = $query->first();

        // Fallback: If student searched by email or regId didn't match with email, check email match
        if (!$candidate && $email) {
            $candidateByEmail = Student::where('email', $email)->first();
            if ($candidateByEmail && (empty($regId) || strcasecmp($candidateByEmail->registration_id, $regId) === 0)) {
                $candidate = $candidateByEmail;
            }
        }

        if (!$candidate) {
            return response()->json([
                'message' => 'Invalid Login details. Please ensure your Registered Email and Registration ID match.'
            ], 401);
        }

        $candidate->update(['last_login_at' => Carbon::now()]);

        return response()->json([
            'message'         => 'Login successful!',
            'token'           => $candidate->uuid,
            'full_name'       => $candidate->full_name,
            'email'           => $candidate->email,
            'registration_id' => $candidate->registration_id,
            'last_login_at'   => $candidate->last_login_at?->toIso8601String(),
        ], 200);
    }

    /**
     * Unified Register-or-Login endpoint.
     *
     * - If the email already exists → log the candidate in (return their token).
     * - If the email is new       → validate all fields, register, then log in.
     *
     * Frontend no longer needs two separate tabs / two separate calls.
     */
    public function registerOrLogin(Request $request)
    {
        $email = trim($request->input('email', ''));

        // ── 1. Check if candidate already exists by email ──────────────────
        $existing = Student::where('email', $email)->first();

        if ($existing) {
            // Returning candidate – just log them in
            $existing->update(['last_login_at' => Carbon::now()]);

            return response()->json([
                'message'         => 'Welcome back! You have been logged in.',
                'is_new'          => false,
                'token'           => $existing->uuid,
                'registration_id' => $existing->registration_id,
                'full_name'       => $existing->full_name,
            ], 200);
        }

        // ── 2. New candidate – validate all required registration fields ────
        $validated = $request->validate([
            'full_name'            => 'required|string|max:255',
            'gender'               => 'required|string|in:Male,Female,Other',
            'company_name'         => 'required|string|max:255',
            'academic_institution' => 'required|string|max:255',
            'phone'                => 'required|string|max:50',
            'email'                => 'required|email|max:255|unique:students,email',
            'country'              => 'required|string|max:255',
        ]);

        $uuid = (string) Str::uuid();

        $candidate = Student::create([
            'uuid'                 => $uuid,
            'full_name'            => $validated['full_name'],
            'gender'               => $validated['gender'],
            'company_name'         => $validated['company_name'],
            'academic_institution' => $validated['academic_institution'],
            'phone'                => $validated['phone'],
            'email'                => $validated['email'],
            'country'              => $validated['country'],
            'password'             => '',
        ]);

        $registrationId = 'AIXX-REG-' . $candidate->id;
        $candidate->update([
            'registration_id' => $registrationId,
            'last_login_at'   => Carbon::now(),
        ]);

        return response()->json([
            'message'         => 'Registration successful! Welcome to the AIXX Certificate Portal.',
            'is_new'          => true,
            'token'           => $uuid,
            'registration_id' => $registrationId,
            'full_name'       => $validated['full_name'],
        ], 201);
    }

    /**
     * Get full candidate profile details by token (for the profile page)
     */
    public function getCandidateProfile(Request $request)
    {
        $uuid = $request->query('token');

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $candidate = Student::where('uuid', $uuid)->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid or expired token.'], 404);
        }

        $freeAttempt = \App\Models\CertificateAttempt::where('student_id', $candidate->id)
            ->whereHas('training', function($q) {
                $q->where('slug', 'free-ai-knowledge-certificate-program');
            })
            ->orderByDesc('created_at')
            ->first();

        return response()->json([
            'full_name'            => $candidate->full_name,
            'email'                => $candidate->email,
            'gender'               => $candidate->gender,
            'phone'                => $candidate->phone,
            'country'              => $candidate->country,
            'company_name'         => $candidate->company_name,
            'academic_institution' => $candidate->academic_institution,
            'registration_id'      => $candidate->registration_id,
            'passed'               => $freeAttempt ? current((array) $freeAttempt->passed) : false,
            'test_score'           => $freeAttempt ? current((array) $freeAttempt->score) : null,
        ], 200);
    }

    /**
     * Get the candidate's enrolled "courses" (their AI certificate registration + catalog enrollments).
     * Returns an array of courses.
     */
    public function getMyCourses(Request $request)
    {
        $identifier = $request->query('registration_id') ?? $request->query('token');

        if (!$identifier) {
            return response()->json([], 200);
        }

        $candidate = Student::where('registration_id', $identifier)
            ->orWhere('uuid', $identifier)
            ->first();

        if (!$candidate) {
            return response()->json([], 200);
        }

        return response()->json($this->formatStudentCourses($candidate), 200);
    }

    /**
     * Format all courses for a candidate
     */
    protected function formatStudentCourses(Student $candidate): array
    {
        $courses = [];

        // 1. Default Free AI Knowledge Certificate
        if ($candidate->registration_id) {
            $freeAttempt = \App\Models\CertificateAttempt::where('student_id', $candidate->id)
                ->whereHas('training', function($q) {
                    $q->where('slug', 'free-ai-knowledge-certificate-program');
                })
                ->orderByDesc('created_at')
                ->first();
                
            $isPassed = $freeAttempt ? current((array) $freeAttempt->passed) : false;
            $score = $freeAttempt ? current((array) $freeAttempt->score) : null;

            $courses[] = [
                'registration_id' => $candidate->registration_id,
                'course_id'       => 'free-ai-certificate',
                'title'           => 'Free AI Knowledge Certificate',
                'description'     => 'AIXX AI Knowledge Certificate Program',
                'passed'          => $isPassed,
                'test_score'      => $score,
                'status'          => $isPassed ? 'Completed' : 'In Progress',
            ];
        }

        // 2. Custom Enrolled Courses
        if (!empty($candidate->enrolled_courses) && is_array($candidate->enrolled_courses)) {
            foreach ($candidate->enrolled_courses as $item) {
                $courses[] = [
                    'registration_id' => $candidate->registration_id,
                    'course_id'       => $item['course_id'] ?? ('course-' . rand(100, 999)),
                    'title'           => $item['title'] ?? 'Enrolled Course',
                    'description'     => $item['description'] ?? '',
                    'status'          => $item['status'] ?? 'Enrolled',
                    'enrolled_at'     => $item['enrolled_at'] ?? null,
                ];
            }
        }

        return $courses;
    }

    /**
     * Enroll candidate in a course using Registration ID or token
     */
    public function enrollCourse(Request $request)
    {
        $identifier = trim($request->input('registration_id', '') ?: $request->input('token', ''));
        $courseId = $request->input('course_id');
        $courseTitle = $request->input('title') ?: $request->input('course_title');
        $description = $request->input('description', 'AIXX Academy Professional Course');

        if (!$identifier || !$courseId || !$courseTitle) {
            return response()->json(['message' => 'Student ID and course details are required.'], 400);
        }

        $candidate = Student::where('registration_id', $identifier)
            ->orWhere('uuid', $identifier)
            ->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid Student Registration ID or token.'], 404);
        }

        $enrolled = $candidate->enrolled_courses ?? [];

        // Check if already enrolled
        $alreadyEnrolled = false;
        foreach ($enrolled as $c) {
            if (isset($c['course_id']) && $c['course_id'] === $courseId) {
                $alreadyEnrolled = true;
                break;
            }
        }

        if (!$alreadyEnrolled) {
            $enrolled[] = [
                'course_id'       => $courseId,
                'registration_id' => $candidate->registration_id,
                'title'           => $courseTitle,
                'description'     => $description,
                'enrolled_at'     => Carbon::now()->toIso8601String(),
                'status'          => 'Enrolled',
            ];
            $candidate->enrolled_courses = $enrolled;
            $candidate->save();
        }

        return response()->json([
            'message'          => 'Successfully enrolled in course!',
            'candidate_name'   => $candidate->full_name,
            'registration_id'  => $candidate->registration_id,
            'courses'          => $this->formatStudentCourses($candidate),
        ], 200);
    }

    /**
     * Remove / Un-enroll student from a course
     */
    public function unenrollCourse(Request $request)
    {
        $identifier = trim($request->input('registration_id', '') ?: $request->input('token', ''));
        $courseId = $request->input('course_id');

        if (!$identifier || !$courseId) {
            return response()->json(['message' => 'Student ID and course ID are required.'], 400);
        }

        $candidate = Student::where('registration_id', $identifier)
            ->orWhere('uuid', $identifier)
            ->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid Student Registration ID or token.'], 404);
        }

        $enrolled = $candidate->enrolled_courses ?? [];

        // Filter out the course to remove
        $updatedEnrolled = array_values(array_filter($enrolled, function ($item) use ($courseId) {
            return isset($item['course_id']) && $item['course_id'] !== $courseId;
        }));

        $candidate->enrolled_courses = $updatedEnrolled;
        $candidate->save();

        return response()->json([
            'message'          => 'Course removed successfully.',
            'candidate_name'   => $candidate->full_name,
            'registration_id'  => $candidate->registration_id,
            'courses'          => $this->formatStudentCourses($candidate),
        ], 200);
    }


    /**
     * Update candidate personal profile details by token
     */
    public function updateCandidateProfile(Request $request)
    {
        $uuid = $request->input('token');

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $candidate = Student::where('uuid', $uuid)->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid or expired token.'], 404);
        }

        $validated = $request->validate([
            'full_name'            => 'required|string|max:255',
            'email'                => 'required|email|max:255|unique:students,email,' . $candidate->id,
            'phone'                => 'required|string|max:50',
            'country'              => 'required|string|max:255',
            'company_name'         => 'required|string|max:255',
            'academic_institution' => 'required|string|max:255',
            'gender'               => 'required|string|in:Male,Female,Other',
        ]);

        $candidate->update($validated);

        return response()->json([
            'message'              => 'Profile updated successfully.',
            'full_name'            => $candidate->fresh()->full_name,
            'email'                => $candidate->fresh()->email,
            'gender'               => $candidate->fresh()->gender,
            'phone'               => $candidate->fresh()->phone,
            'country'              => $candidate->fresh()->country,
            'company_name'         => $candidate->fresh()->company_name,
            'academic_institution' => $candidate->fresh()->academic_institution,
            'registration_id'      => $candidate->fresh()->registration_id,
        ], 200);
    }

    /**
     * Verify candidate access token
     */
    public function verifyToken(Request $request)
    {
        $uuid = $request->query('token');

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $candidate = Student::where('uuid', $uuid)->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid or expired test token.'], 404);
        }

        if ($candidate->passed) {
            return response()->json([
                'message' => 'Test already completed successfully.',
                'already_passed' => true,
                'full_name' => $candidate->full_name,
                'registration_id' => $candidate->registration_id,
                'score' => $candidate->test_score,
                'passed_at' => $candidate->passed_at ? $candidate->passed_at->format('d M Y') : ''
            ], 200);
        }

        return response()->json([
            'message' => 'Token verified successfully.',
            'already_passed' => false,
            'full_name' => $candidate->full_name,
            'registration_id' => $candidate->registration_id,
        ], 200);
    }

    /**
     * Get 20 MCQ test questions (Strip correct answers for security)
     */
    public function getQuestions(Request $request)
    {
        $uuid = $request->query('token');
        // Currently, we'll assume the Free AI Course (ID: 128) if no course slug is passed. 
        // In a fully dynamic system, the token (Student) should be tied to a course, 
        // or the frontend should pass the course ID/slug.
        $courseSlug = $request->query('course_slug', 'free-ai-knowledge-certificate-program');

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $candidate = Student::where('uuid', $uuid)->first();

        if (!$candidate) {
            return response()->json(['message' => 'Unauthorized token.'], 403);
        }

        $training = \App\Models\Training::where('slug', $courseSlug)->first();
        if (!$training) {
             return response()->json(['message' => 'Course not found.'], 404);
        }

        // Find an incomplete attempt for this student AND course, or create one
        $attempt = CertificateAttempt::where('student_id', $candidate->id)
            ->where('training_id', $training->id)
            ->where('is_completed', false)
            ->first();

        if (!$attempt) {
            $attempt = CertificateAttempt::create([
                'student_id' => $candidate->id,
                'training_id' => $training->id,
            ]);

            // Pick random questions from the bank for this SPECIFIC course
            $questions = CertificateQuestion::where('training_id', $training->id)
                ->where('is_active', true)
                ->inRandomOrder()
                ->limit(20)
                ->get();
            
            if ($questions->isEmpty()) {
                 return response()->json(['message' => 'No questions available for this course.'], 400);
            }

            foreach ($questions as $q) {
                // Shuffle options
                $originalOptions = $q->options;
                $indices = array_keys($originalOptions);
                shuffle($indices);

                // Map to A, B, C, D (or more if there are more options)
                $letters = range('A', 'Z');
                $mapping = [];
                foreach ($indices as $i => $originalIndex) {
                    $letter = $letters[$i];
                    $mapping[$letter] = $originalIndex; // Store which original index this letter represents
                }

                CertificateAttemptQuestion::create([
                    'certificate_attempt_id' => $attempt->id,
                    'certificate_question_id' => $q->id,
                    'options_mapping' => $mapping,
                ]);
            }
        }

        // Return the mapped questions to the frontend
        $attemptQuestions = CertificateAttemptQuestion::where('certificate_attempt_id', $attempt->id)
            ->with('question')
            ->get();

        $publicQuestions = [];
        foreach ($attemptQuestions as $aq) {
            $q = $aq->question;
            $optionsToPresent = [];
            foreach ($aq->options_mapping as $letter => $originalIndex) {
                $optionsToPresent[$letter] = $q->options[$originalIndex];
            }

            $publicQuestions[] = [
                'id' => $aq->id, // Use the AttemptQuestion ID so we can track answers exactly
                'question' => $q->question,
                'options' => $optionsToPresent,
            ];
        }

        return response()->json([
            'questions' => $publicQuestions
        ], 200);
    }

    /**
     * Grade submitted responses and update status
     */
    public function submitTest(Request $request)
    {
        $uuid = $request->input('token');
        $answers = $request->input('answers'); // [attempt_question_id => selected_option_letter]
        $courseSlug = $request->input('course_slug', 'free-ai-knowledge-certificate-program');

        if (!$uuid) {
            return response()->json(['message' => 'Token parameter is missing.'], 400);
        }

        $candidate = Student::where('uuid', $uuid)->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid or unauthorized candidate token.'], 403);
        }

        $training = \App\Models\Training::where('slug', $courseSlug)->first();
        if (!$training) {
             return response()->json(['message' => 'Course not found.'], 404);
        }

        $attempt = CertificateAttempt::where('student_id', $candidate->id)
            ->where('training_id', $training->id)
            ->where('is_completed', false)
            ->first();

        if (!$attempt) {
            return response()->json(['message' => 'No active attempt found.'], 404);
        }

        $attemptQuestions = CertificateAttemptQuestion::where('certificate_attempt_id', $attempt->id)->with('question')->get();
        $totalQuestions = $attemptQuestions->count();

        if ($totalQuestions === 0) {
            return response()->json(['message' => 'No questions found for this attempt.'], 400);
        }

        $correctCount = 0;

        foreach ($attemptQuestions as $aq) {
            $submittedLetter = $answers[$aq->id] ?? null;
            $isCorrect = false;

            if ($submittedLetter && isset($aq->options_mapping[$submittedLetter])) {
                $mappedOriginalIndex = $aq->options_mapping[$submittedLetter];
                if ($mappedOriginalIndex === $aq->question->correct_answer_index) {
                    $isCorrect = true;
                    $correctCount++;
                }
            }

            $aq->update([
                'selected_option_key' => $submittedLetter,
                'is_correct' => $isCorrect,
            ]);
        }

        $percentageScore = round(($correctCount / $totalQuestions) * 100);
        $hasPassed = ($percentageScore >= 80);

        // Complete the attempt
        $attempt->update([
            'is_completed' => true,
            'score' => $percentageScore,
            'passed' => $hasPassed,
            'completed_at' => Carbon::now(),
        ]);

        // Record is maintained in CertificateAttempt, so we don't need to save to Student table.

        // Include the actual questions and answers mapped out so the frontend can display the results UI
        $resultsDetails = [];
        foreach ($attemptQuestions as $aq) {
            $q = $aq->question;
            
            $optionsToPresent = [];
            foreach ($aq->options_mapping as $letter => $originalIndex) {
                $optionsToPresent[$letter] = $q->options[$originalIndex];
            }

            // Find the correct letter for this attempt
            $correctLetter = null;
            foreach ($aq->options_mapping as $letter => $originalIndex) {
                if ($originalIndex === $q->correct_answer_index) {
                    $correctLetter = $letter;
                    break;
                }
            }

            $resultsDetails[] = [
                'question' => $q->question,
                'options' => $optionsToPresent,
                'selected_option' => $aq->selected_option_key,
                'correct_option' => $correctLetter,
                'is_correct' => $aq->is_correct,
                'explanation' => $q->explanation
            ];
        }

        return response()->json([
            'passed' => $hasPassed,
            'score' => $percentageScore,
            'correct_count' => $correctCount,
            'total_questions' => $totalQuestions,
            'full_name' => $candidate->full_name,
            'passed_at' => $candidate->passed_at ? $candidate->passed_at->format('d M Y') : Carbon::now()->format('d M Y'),
            'results_details' => $resultsDetails
        ], 200);
    }
}

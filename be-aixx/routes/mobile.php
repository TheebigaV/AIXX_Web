<?php

use App\Http\Controllers\Api\Mobile\AiksController;
use App\Http\Controllers\Api\Mobile\AmbassadorController;
use App\Http\Controllers\Api\Mobile\AnalyticsController;
use App\Http\Controllers\Api\Mobile\AssessmentController;
use App\Http\Controllers\Api\Mobile\AssignmentController;
use App\Http\Controllers\Api\Mobile\CertificationController;
use App\Http\Controllers\Api\Mobile\CurriculumController;
use App\Http\Controllers\Api\Mobile\LearnerProfileController;
use App\Http\Controllers\Api\Mobile\LearningContentController;
use App\Http\Controllers\Api\Mobile\AuthController;
use App\Http\Controllers\Api\Mobile\CertificateController;
use App\Http\Controllers\Api\Mobile\CourseController;
use App\Http\Controllers\Api\Mobile\PaymentWebhookController;
use App\Http\Controllers\Api\Mobile\RoadmapController;
use App\Http\Controllers\Api\Mobile\SurveyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mobile App API Routes
|--------------------------------------------------------------------------
|
| Routes consumed exclusively by the AIXX mobile app, as defined in the
| mobile API list. All endpoints share the same underlying data/business
| logic as the web app — these controllers wrap the same models, just
| authenticated via Sanctum bearer tokens instead of the web's query
| token / session flow. Admin-only endpoints are intentionally NOT here;
| they live in routes/api.php under the existing admin group.
|
*/

// 1. Authentication & Profile
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('auth/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);

// 5. Certificates — public verification (no auth required)
Route::get('certificate/verify/{token}', [CertificateController::class, 'verify']);

// 8. Webhooks — server-to-server, no user auth
Route::post('payments/webhook', [PaymentWebhookController::class, 'handle']);

// 7. Analytics — works for both guests and authenticated users
Route::post('analytics/events', [AnalyticsController::class, 'ingest']);

// 3. Assessments — Legacy endpoints reuse the existing token-based web flow
Route::post('assessment/submit', [AssessmentController::class, 'legacySubmit']);
Route::get('assessment/questions/{moduleId}', [AssessmentController::class, 'legacyModuleQuestions']);

// 2. Courses & Learning Paths — public catalog browsing.
// Note: routes/api.php already exposes GET courses and courses/{slug} publicly,
// and both delegate to the exact same WebCourseController methods as these do,
// so whichever route object matches first, the response is identical.
Route::get('courses', [CourseController::class, 'index']);
Route::get('courses/{slug}', [CourseController::class, 'show']);
// Overrides the routes/api.php definition (mobile.php is registered last) to clean question/option text.
Route::get('courses/{slug}/modules/{moduleIndex}', [CourseController::class, 'getModule'])->whereNumber('moduleIndex');
Route::get('learning-paths', [CourseController::class, 'learningPaths']);
Route::get('learning-paths/{id}', [CourseController::class, 'showLearningPath']);

// 9. Roadmaps — destinations are browsable without login
Route::get('roadmap/destinations', [RoadmapController::class, 'destinations']);

// 10. Structured curriculum (Learn → Check → Scenario → Review → Assess) — content is public;
// learner state (steps, answered checks, acknowledgement) is added when a bearer token is sent.
Route::get('languages', [LearningContentController::class, 'languages']);
Route::get('courses/{slug}/curriculum', [CurriculumController::class, 'curriculum']);
Route::get('courses/{slug}/glossary', [CurriculumController::class, 'glossary']);
Route::get('courses/{slug}/assessment/blueprint', [CertificationController::class, 'blueprint']);
Route::prefix('courses/{slug}/modules/{moduleIndex}')->whereNumber('moduleIndex')->group(function () {
    Route::get('lesson', [CurriculumController::class, 'lesson']);
    Route::get('terminology', [CurriculumController::class, 'terminology']);
    Route::get('scenarios', [CurriculumController::class, 'scenarios']);
    Route::get('summary', [CurriculumController::class, 'summary']);
    Route::get('knowledge-checks', [CurriculumController::class, 'knowledgeChecks']);
});

Route::middleware('auth:student')->group(function () {
    // 1. Authentication & Profile
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('me', [AuthController::class, 'updateProfile']);
    Route::patch('me/preferences', [AuthController::class, 'updatePreferences']);
    Route::get('me/module-results', [CourseController::class, 'moduleResults']);

    // 3. Assessments
    Route::post('assessment/attempts', [AssessmentController::class, 'start']);
    Route::get('assessment/attempts/{id}', [AssessmentController::class, 'resume']);
    Route::post('assessment/attempts/{id}/answers', [AssessmentController::class, 'submitAnswer']);
    Route::post('assessment/attempts/{id}/complete', [AssessmentController::class, 'complete']);
    Route::get('assessment/results', [AssessmentController::class, 'results']);

    // 4. AIKS (AI Knowledge Scale)
    Route::get('aiks/latest', [AiksController::class, 'latest']);
    Route::get('aiks/history', [AiksController::class, 'history']);

    // 5. Surveys & Certificates
    Route::get('survey', [SurveyController::class, 'index']);
    Route::post('survey/{courseId}/submit', [SurveyController::class, 'submit']);
    Route::get('survey/{courseId}/status', [SurveyController::class, 'status']);
    Route::get('certificate', [CertificateController::class, 'index']);
    Route::get('certificate/{id}', [CertificateController::class, 'show']);

    // 6. Ambassadors (Commercial & Payouts) — self-service only, admin actions live on the web side
    Route::post('ambassador/enrol', [AmbassadorController::class, 'enrol']);
    Route::get('ambassador/me', [AmbassadorController::class, 'me']);
    Route::get('ambassador/me/commissions', [AmbassadorController::class, 'commissions']);
    Route::get('ambassador/me/referrals', [AmbassadorController::class, 'referrals']);

    // 9. Roadmaps — destination + study-load (hours/week) pacing
    Route::get('roadmap', [RoadmapController::class, 'show']);
    Route::post('roadmap', [RoadmapController::class, 'store']);
    Route::patch('roadmap/load', [RoadmapController::class, 'updateLoad']);
    Route::delete('roadmap', [RoadmapController::class, 'destroy']);

    // 10. Structured curriculum — learner actions
    Route::post('courses/{slug}/acknowledge', [CurriculumController::class, 'acknowledge']);
    Route::post('courses/{slug}/modules/{moduleIndex}/knowledge-checks/{checkId}/answer', [CurriculumController::class, 'answerKnowledgeCheck'])
        ->whereNumber(['moduleIndex', 'checkId']);
    Route::post('courses/{slug}/modules/{moduleIndex}/steps/{step}/complete', [CurriculumController::class, 'completeStep'])
        ->whereNumber('moduleIndex');
    Route::post('questions/{id}/feedback', [LearningContentController::class, 'questionFeedback'])->whereNumber('id');

    // 11. Certification assessment (blueprint-driven, topic-balanced)
    Route::post('courses/{slug}/certification/attempts', [CertificationController::class, 'start']);
    Route::get('certification/attempts', [CertificationController::class, 'index']);
    Route::get('certification/attempts/{id}', [CertificationController::class, 'show'])->whereNumber('id');
    Route::post('certification/attempts/{id}/answers', [CertificationController::class, 'answer'])->whereNumber('id');
    Route::post('certification/attempts/{id}/complete', [CertificationController::class, 'complete'])->whereNumber('id');

    // 12. Learner profile, progression and enterprise assignments
    Route::get('me/competency-profile', [LearnerProfileController::class, 'competencyProfile']);
    Route::get('me/next-steps', [LearnerProfileController::class, 'nextSteps']);
    Route::get('me/badges', [LearnerProfileController::class, 'badges']);
    Route::get('me/career-passport', [LearnerProfileController::class, 'careerPassport']);
    Route::get('me/assignments', [AssignmentController::class, 'index']);
    Route::post('me/assignments/{id}/acknowledge', [AssignmentController::class, 'acknowledge'])->whereNumber('id');
});

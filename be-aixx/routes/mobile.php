<?php

use App\Http\Controllers\Api\Mobile\AiksController;
use App\Http\Controllers\Api\Mobile\AmbassadorController;
use App\Http\Controllers\Api\Mobile\AnalyticsController;
use App\Http\Controllers\Api\Mobile\AssessmentController;
use App\Http\Controllers\Api\Mobile\AuthController;
use App\Http\Controllers\Api\Mobile\CertificateController;
use App\Http\Controllers\Api\Mobile\CourseController;
use App\Http\Controllers\Api\Mobile\PaymentWebhookController;
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
Route::get('courses/{id}', [CourseController::class, 'show']);
Route::get('learning-paths', [CourseController::class, 'learningPaths']);
Route::get('learning-paths/{id}', [CourseController::class, 'showLearningPath']);

Route::middleware('auth:student')->group(function () {
    // 1. Authentication & Profile
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::patch('me/preferences', [AuthController::class, 'updatePreferences']);

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
});

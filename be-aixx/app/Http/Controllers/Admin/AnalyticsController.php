<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateAttempt;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    /**
     * GET /api/admin/analytics/funnel — View analytics funnel.
     * Computed from real enrollment/assessment data rather than raw event logs,
     * so it stays meaningful even for tenants that haven't wired up event tracking yet.
     */
    public function funnel(): JsonResponse
    {
        $registered = Student::count();

        $startedCourse = Student::query()
            ->whereJsonLength('enrolled_courses', '>', 0)
            ->count();

        $completedAssessment = CertificateAttempt::where('is_completed', true)
            ->distinct('student_id')
            ->count('student_id');

        $certified = CertificateAttempt::where('passed', true)
            ->whereNull('revoked_at')
            ->distinct('student_id')
            ->count('student_id');

        $stages = [
            ['stage' => 'registered', 'count' => $registered],
            ['stage' => 'started_course', 'count' => $startedCourse],
            ['stage' => 'completed_assessment', 'count' => $completedAssessment],
            ['stage' => 'certified', 'count' => $certified],
        ];

        $base = $registered ?: 1;
        foreach ($stages as &$stage) {
            $stage['conversion_rate'] = round(($stage['count'] / $base) * 100, 1);
        }

        return response()->json(['success' => true, 'data' => $stages], 200);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateAttempt;
use App\Models\Student;
use App\Models\Tenant;
use App\Models\TenantDepartment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    /**
     * GET /api/admin/tenants — List tenants.
     */
    public function index(Request $request): JsonResponse
    {
        $tenants = Tenant::withCount('students', 'departments')
            ->orderByDesc('created_at')
            ->paginate((int) $request->get('per_page', 15));

        return response()->json(['success' => true, 'data' => $tenants], 200);
    }

    /**
     * POST /api/admin/tenants — Create a new tenant.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'target_completion_date' => 'nullable|date',
        ]);

        $tenant = Tenant::create($validated);

        return response()->json(['success' => true, 'data' => $tenant], 201);
    }

    /**
     * GET /api/admin/tenants/{id}/dashboard — Get enterprise KPIs.
     */
    public function dashboard(int $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);

        $studentIds = Student::where('tenant_id', $tenant->id)->pluck('id');
        $totalStudents = $studentIds->count();
        $certifiedCount = CertificateAttempt::whereIn('student_id', $studentIds)->where('passed', true)->distinct('student_id')->count('student_id');
        $inProgressCount = Student::where('tenant_id', $tenant->id)
            ->whereJsonLength('enrolled_courses', '>', 0)
            ->count();

        $completionRate = $totalStudents > 0 ? (int) round(($certifiedCount / $totalStudents) * 100) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'tenant' => ['id' => $tenant->id, 'name' => $tenant->name, 'status' => $tenant->status],
                'total_employees' => $totalStudents,
                'in_progress' => $inProgressCount,
                'certified' => $certifiedCount,
                'completion_rate' => $completionRate,
                'target_completion_date' => $tenant->target_completion_date?->toDateString(),
            ],
        ], 200);
    }

    /**
     * GET /api/admin/tenants/{id}/departments — Get department heatmap data.
     */
    public function departments(int $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);

        $departments = $tenant->departments()->get()->map(fn (TenantDepartment $d) => [
            'id' => $d->id,
            'name' => $d->name,
            'employees_count' => $d->employees_count,
            'completed_count' => $d->completed_count,
            'completion_rate' => $d->completion_rate,
            'heat' => match (true) {
                $d->completion_rate >= 75 => 'high',
                $d->completion_rate >= 40 => 'medium',
                default => 'low',
            },
        ]);

        return response()->json(['success' => true, 'data' => $departments], 200);
    }

    /**
     * PATCH /api/admin/tenants/{id}/target — Set completion target date.
     */
    public function setTarget(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'target_completion_date' => 'required|date',
        ]);

        $tenant = Tenant::findOrFail($id);
        $tenant->update($validated);

        return response()->json(['success' => true, 'data' => $tenant], 200);
    }

    /**
     * GET /api/admin/tenants/{id}/recommended-actions — Get recommended actions.
     */
    public function recommendedActions(int $id): JsonResponse
    {
        $tenant = Tenant::findOrFail($id);
        $departments = $tenant->departments()->get();

        $actions = [];

        foreach ($departments as $department) {
            if ($department->completion_rate < 40) {
                $actions[] = [
                    'priority' => 'high',
                    'department' => $department->name,
                    'action' => "Send a reminder campaign to {$department->name} — completion is at {$department->completion_rate}%.",
                ];
            } elseif ($department->completion_rate < 75) {
                $actions[] = [
                    'priority' => 'medium',
                    'department' => $department->name,
                    'action' => "Nudge {$department->name} learners nearing completion ({$department->completion_rate}%).",
                ];
            }
        }

        if ($tenant->target_completion_date && $tenant->target_completion_date->isPast()) {
            $actions[] = [
                'priority' => 'high',
                'department' => null,
                'action' => 'The completion target date has passed. Consider setting a new target date.',
            ];
        }

        if (empty($actions)) {
            $actions[] = [
                'priority' => 'low',
                'department' => null,
                'action' => 'All departments are tracking well. No action needed right now.',
            ];
        }

        return response()->json(['success' => true, 'data' => $actions], 200);
    }
}

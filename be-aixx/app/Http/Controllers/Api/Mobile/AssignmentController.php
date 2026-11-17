<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Models\LearningAssignment;
use App\Models\LearningAssignmentAcknowledgement;
use App\Models\Student;
use App\Services\AssignmentStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Enterprise customisation layer: learning assigned by the learner's tenant
 * (optionally per department), with due dates, mandatory acknowledgement and
 * recurrent-training expiry. Tenant-isolated: learners only see their own tenant's items.
 */
class AssignmentController extends Controller
{
    public function __construct(protected AssignmentStatusService $assignments)
    {
    }

    /** GET /api/me/assignments */
    public function index(Request $request): JsonResponse
    {
        /** @var Student $student */
        $student = $request->user();
        $data = $this->assignments->visibleTo($student)->get()->map(fn (LearningAssignment $a) => $this->present($a, $student))->values();

        return response()->json([
            'success' => true,
            'count' => $data->count(),
            'summary' => [
                'mandatory' => $data->where('is_mandatory', true)->count(),
                'completed' => $data->where('status', 'completed')->count(),
                'overdue' => $data->where('status', 'overdue')->count(),
                'expired' => $data->where('status', 'expired')->count(),
                'pending_acknowledgement' => $data->where('acknowledgement.required', true)->where('acknowledgement.acknowledged', false)->count(),
            ],
            'data' => $data,
        ]);
    }

    /** POST /api/me/assignments/{id}/acknowledge */
    public function acknowledge(int $id, Request $request): JsonResponse
    {
        /** @var Student $student */
        $student = $request->user();
        $assignment = $this->assignments->visibleTo($student)->find($id);
        if (!$assignment) {
            return response()->json(['success' => false, 'message' => 'Assignment not found.'], 404);
        }

        $request->validate(['accepted' => 'required|accepted']);

        LearningAssignmentAcknowledgement::updateOrCreate(
            ['learning_assignment_id' => $assignment->id, 'student_id' => $student->id],
            ['version' => $assignment->version, 'acknowledged_at' => now()]
        );

        return response()->json(['success' => true, 'data' => $this->present($assignment->fresh(), $student)]);
    }

    protected function present(LearningAssignment $a, Student $student): array
    {
        $s = $this->assignments->statusFor($a, $student);
        $base = collect($this->assignments->describe($a))->except(['tenant_id', 'is_active', 'requires_acknowledgement'])->all();

        return $base + [
            'status' => $s['status'],
            'completed_at' => $s['completed_at']?->toIso8601String(),
            'expires_at' => $s['expires_at']?->toIso8601String(),
            'acknowledgement' => [
                'required' => $a->requires_acknowledgement,
                'acknowledged' => $s['acknowledged'],
                'acknowledged_at' => $s['acknowledged_at']?->toIso8601String(),
            ],
        ];
    }
}

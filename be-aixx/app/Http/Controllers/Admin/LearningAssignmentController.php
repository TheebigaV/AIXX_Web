<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LearningAssignment;
use App\Models\Student;
use App\Models\TrainingModule;
use App\Services\AssignmentStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Enterprise training departments: create learning assignments for a tenant
 * (or one department) and report completion per learner (manager dashboard).
 */
class LearningAssignmentController extends Controller
{
    public function __construct(protected AssignmentStatusService $assignments)
    {
    }

    /** GET /api/admin/learning-assignments?tenant_id=&is_active= */
    public function index(Request $request): JsonResponse
    {
        $page = LearningAssignment::query()
            ->when($request->filled('tenant_id'), fn ($q) => $q->where('tenant_id', $request->integer('tenant_id')))
            ->when($request->has('is_active'), fn ($q) => $q->where('is_active', $request->boolean('is_active')))
            ->latest('id')
            ->paginate((int) $request->get('per_page', 15));

        $page->setCollection($page->getCollection()->map(fn (LearningAssignment $a) => $this->assignments->describe($a)));

        return response()->json(['success' => true, 'data' => $page]);
    }

    /** POST /api/admin/learning-assignments */
    public function store(Request $request): JsonResponse
    {
        $assignment = LearningAssignment::create($this->validated($request, true));

        return response()->json(['success' => true, 'data' => $this->assignments->describe($assignment)], 201);
    }

    /** GET /api/admin/learning-assignments/{id} */
    public function show(int $id): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->assignments->describe(LearningAssignment::findOrFail($id))]);
    }

    /** PUT /api/admin/learning-assignments/{id} — Changing "version" asks learners to acknowledge again. */
    public function update(int $id, Request $request): JsonResponse
    {
        $assignment = LearningAssignment::findOrFail($id);
        $assignment->update($this->validated($request, false, $assignment));

        return response()->json(['success' => true, 'data' => $this->assignments->describe($assignment->fresh())]);
    }

    /** DELETE /api/admin/learning-assignments/{id} */
    public function destroy(int $id): JsonResponse
    {
        LearningAssignment::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Assignment deleted.']);
    }

    /**
     * GET /api/admin/learning-assignments/{id}/report — Manager report: status per targeted learner.
     * Optional ?status=completed|pending|overdue|expired filter on the learner list.
     */
    public function report(int $id, Request $request): JsonResponse
    {
        $assignment = LearningAssignment::findOrFail($id);

        $learners = $this->assignments->targetsOf($assignment)->orderBy('full_name')->get()->map(function (Student $s) use ($assignment) {
            $st = $this->assignments->statusFor($assignment, $s);
            return [
                'student_id' => $s->id,
                'registration_id' => $s->registration_id,
                'full_name' => $s->full_name,
                'department' => $s->department,
                'status' => $st['status'],
                'completed_at' => $st['completed_at']?->toIso8601String(),
                'expires_at' => $st['expires_at']?->toIso8601String(),
                'acknowledged' => $st['acknowledged'],
                'acknowledged_at' => $st['acknowledged_at']?->toIso8601String(),
            ];
        });

        $total = $learners->count();
        $counts = collect(['completed', 'pending', 'overdue', 'expired'])->mapWithKeys(fn ($k) => [$k => $learners->where('status', $k)->count()]);

        return response()->json(['success' => true, 'data' => [
            'assignment' => $this->assignments->describe($assignment),
            'summary' => $counts->all() + [
                'total_learners' => $total,
                'completion_rate' => $total ? (int) round($counts['completed'] * 100 / $total) : 0,
                'acknowledged' => $learners->where('acknowledged', true)->count(),
            ],
            'learners' => $learners->when($request->filled('status'), fn ($l) => $l->where('status', $request->query('status')))->values(),
        ]]);
    }

    protected function validated(Request $request, bool $creating, ?LearningAssignment $current = null): array
    {
        $req = $creating ? 'required' : 'sometimes';

        $data = $request->validate([
            'tenant_id' => [$req, 'integer', 'exists:tenants,id'],
            'department' => 'nullable|string|max:255',
            'training_id' => 'nullable|integer|exists:trainings,id',
            'training_module_id' => 'nullable|integer|exists:training_modules,id',
            'title' => [$req, 'string', 'max:255'],
            'description' => 'nullable|string',
            'target_group' => 'nullable|string|max:255',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'string|max:255',
            'due_date' => 'nullable|date',
            'is_mandatory' => 'boolean',
            'requires_acknowledgement' => 'boolean',
            'source_document_ref' => 'nullable|string|max:255',
            'content_owner' => 'nullable|string|max:255',
            'approver' => 'nullable|string|max:255',
            'version' => 'nullable|string|max:50',
            'effective_date' => 'nullable|date',
            'recurrence_months' => 'nullable|integer|min:1|max:120',
            'is_active' => 'boolean',
        ]);

        $trainingId = array_key_exists('training_id', $data) ? $data['training_id'] : $current?->training_id;
        $moduleId = array_key_exists('training_module_id', $data) ? $data['training_module_id'] : $current?->training_module_id;

        if (!$trainingId && !$moduleId) {
            abort(response()->json(['success' => false, 'message' => 'Provide training_id or training_module_id.', 'errors' => ['training_id' => ['A course or module is required.']]], 422));
        }

        // A module assignment also records its course, so course-level filters work.
        if ($moduleId) {
            $data['training_id'] = TrainingModule::whereKey($moduleId)->value('training_id');
        }

        return $data;
    }
}

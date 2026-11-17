<?php

namespace App\Services;

use App\Models\LearningAssignment;
use App\Models\LearningAssignmentAcknowledgement;
use App\Models\Student;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

/**
 * Status of an enterprise learning assignment for one learner, shared by the
 * learner's /me/assignments view and the admin manager report.
 */
class AssignmentStatusService
{
    public function __construct(protected LearnerProgressService $progress)
    {
    }

    /** Assignments visible to a learner: their tenant, whole-tenant or their department. */
    public function visibleTo(Student $student): Builder
    {
        return LearningAssignment::query()
            ->where('is_active', true)
            ->where('tenant_id', $student->tenant_id ?? 0)
            ->where(fn ($q) => $q->whereNull('department')->orWhere('department', $student->department))
            ->with(['training:id,name,slug', 'module:id,training_id,module_index,title', 'module.training:id,slug'])
            ->orderByRaw('due_date is null')
            ->orderBy('due_date');
    }

    /** Learners an assignment targets. */
    public function targetsOf(LearningAssignment $a): Builder
    {
        return Student::where('tenant_id', $a->tenant_id)
            ->when($a->department, fn ($q) => $q->where('department', $a->department));
    }

    /** @return array{status: string, completed_at: ?Carbon, expires_at: ?Carbon, acknowledged: bool, acknowledged_at: ?Carbon} */
    public function statusFor(LearningAssignment $a, Student $student): array
    {
        $completedAt = $this->completedAt($a, $student);
        $expiresAt = $completedAt && $a->recurrence_months ? $completedAt->copy()->addMonths($a->recurrence_months) : null;
        $ack = LearningAssignmentAcknowledgement::where('learning_assignment_id', $a->id)->where('student_id', $student->id)->first();
        $acknowledged = $ack !== null && $ack->version === $a->version;

        $status = match (true) {
            $expiresAt !== null && $expiresAt->isPast() => 'expired',
            $completedAt !== null => 'completed',
            $a->due_date !== null && $a->due_date->copy()->endOfDay()->isPast() => 'overdue',
            default => 'pending',
        };

        return [
            'status' => $status,
            'completed_at' => $completedAt,
            'expires_at' => $expiresAt,
            'acknowledged' => $acknowledged,
            'acknowledged_at' => $acknowledged ? $ack->acknowledged_at : null,
        ];
    }

    /** Module assignment: module passed. Course assignment: certification passed, else all modules passed. */
    public function completedAt(LearningAssignment $a, Student $student): ?Carbon
    {
        if ($a->module && $a->module->training) {
            $at = $this->progress->moduleProgress($student, $a->module->training->slug, $a->module->module_index)['completed_at'];
            return $at ? Carbon::parse($at) : null;
        }

        if ($a->training) {
            if ($cert = $this->progress->passedCertification($a->training, $student)) {
                return $cert->completed_at;
            }
            $modules = $this->progress->modulesWithProgress($a->training, $student);
            if ($modules->isNotEmpty() && $modules->every(fn ($m) => $m['progress']['passed'])) {
                return Carbon::parse($modules->pluck('progress.completed_at')->filter()->max());
            }
        }

        return null;
    }

    /** Assignment fields shared by the learner and admin views. */
    public function describe(LearningAssignment $a): array
    {
        $a->loadMissing(['training:id,name,slug', 'module:id,training_id,module_index,title', 'module.training:id,slug']);

        return [
            'id' => $a->id,
            'tenant_id' => $a->tenant_id,
            'title' => $a->title,
            'description' => $a->description,
            'target_group' => $a->target_group,
            'department' => $a->department,
            'prerequisites' => $a->prerequisites ?? [],
            'course' => $a->training ? ['id' => $a->training->id, 'name' => $a->training->name, 'slug' => $a->training->slug] : null,
            'module' => $a->module ? ['id' => $a->module->id, 'course_slug' => $a->module->training?->slug, 'module_index' => $a->module->module_index, 'title' => $a->module->title] : null,
            'is_mandatory' => $a->is_mandatory,
            'requires_acknowledgement' => $a->requires_acknowledgement,
            'due_date' => $a->due_date?->toDateString(),
            'recurrence_months' => $a->recurrence_months,
            'source_document_ref' => $a->source_document_ref,
            'content_owner' => $a->content_owner,
            'approver' => $a->approver,
            'version' => $a->version,
            'effective_date' => $a->effective_date?->toDateString(),
            'is_active' => $a->is_active,
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningAssignment extends Model
{
    protected $fillable = [
        'tenant_id',
        'department',
        'training_id',
        'training_module_id',
        'title',
        'description',
        'target_group',
        'prerequisites',
        'due_date',
        'is_mandatory',
        'requires_acknowledgement',
        'source_document_ref',
        'content_owner',
        'approver',
        'version',
        'effective_date',
        'recurrence_months',
        'is_active',
    ];

    protected $casts = [
        'prerequisites' => 'array',
        'due_date' => 'date',
        'effective_date' => 'date',
        'is_mandatory' => 'boolean',
        'requires_acknowledgement' => 'boolean',
        'is_active' => 'boolean',
        'recurrence_months' => 'integer',
    ];

    public function training()
    {
        return $this->belongsTo(Training::class);
    }

    public function module()
    {
        return $this->belongsTo(TrainingModule::class, 'training_module_id');
    }

    public function acknowledgements()
    {
        return $this->hasMany(LearningAssignmentAcknowledgement::class);
    }
}

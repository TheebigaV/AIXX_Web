<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleContent extends Model
{
    protected $fillable = [
        'training_module_id',
        'lang',
        'study_time',
        'assessment_approach',
        'operational_boundary',
        'competency_area',
        'objectives',
        'terminology',
        'cards',
        'scenarios',
        'summary',
        'version',
        'effective_date',
    ];

    protected $casts = [
        'objectives' => 'array',
        'terminology' => 'array',
        'cards' => 'array',
        'scenarios' => 'array',
        'summary' => 'array',
        'effective_date' => 'date',
    ];

    public function module()
    {
        return $this->belongsTo(TrainingModule::class, 'training_module_id');
    }
}

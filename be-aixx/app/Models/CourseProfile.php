<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseProfile extends Model
{
    protected $fillable = [
        'training_id',
        'lang',
        'target_learner',
        'delivery',
        'boundary_statement',
        'safety_boundary',
        'outcomes',
        'competency_areas',
        'version',
        'effective_date',
    ];

    protected $casts = [
        'outcomes' => 'array',
        'competency_areas' => 'array',
        'effective_date' => 'date',
    ];

    public function training()
    {
        return $this->belongsTo(Training::class);
    }
}

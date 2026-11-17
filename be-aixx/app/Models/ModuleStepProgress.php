<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleStepProgress extends Model
{
    protected $fillable = [
        'student_id',
        'training_module_id',
        'step',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];
}

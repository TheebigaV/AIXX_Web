<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningAssignmentAcknowledgement extends Model
{
    protected $fillable = [
        'learning_assignment_id',
        'student_id',
        'version',
        'acknowledged_at',
    ];

    protected $casts = [
        'acknowledged_at' => 'datetime',
    ];
}

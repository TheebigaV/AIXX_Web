<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseAcknowledgement extends Model
{
    protected $fillable = [
        'student_id',
        'training_id',
        'version',
        'acknowledged_at',
    ];

    protected $casts = [
        'acknowledged_at' => 'datetime',
    ];
}

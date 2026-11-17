<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentRoadmap extends Model
{
    protected $fillable = [
        'student_id',
        'learning_path_id',
        'destination_query',
        'hours_per_week',
        'start_date',
        'plan',
    ];

    protected $casts = [
        'hours_per_week' => 'integer',
        'start_date' => 'date',
        'plan' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function learningPath()
    {
        return $this->belongsTo(LearningPath::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CertificationAttempt extends Model
{
    protected $fillable = [
        'student_id',
        'training_id',
        'status',
        'total_questions',
        'correct_count',
        'score',
        'passed',
        'topic_results',
        'certificate_attempt_id',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'passed' => 'boolean',
        'topic_results' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'score' => 'integer',
        'correct_count' => 'integer',
        'total_questions' => 'integer',
    ];

    public function training()
    {
        return $this->belongsTo(Training::class);
    }

    public function items()
    {
        return $this->hasMany(CertificationAttemptItem::class);
    }

    public function certificateAttempt()
    {
        return $this->belongsTo(CertificateAttempt::class);
    }
}

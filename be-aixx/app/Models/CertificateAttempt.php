<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'training_id',
        'score',
        'passed',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'passed' => 'boolean',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function training()
    {
        return $this->belongsTo(Training::class);
    }

    public function attemptQuestions()
    {
        return $this->hasMany(CertificateAttemptQuestion::class);
    }
}

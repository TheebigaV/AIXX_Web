<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

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
        'certificate_token',
        'issued_at',
        'revoked_at',
    ];

    protected $casts = [
        'passed' => 'boolean',
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
        'issued_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $attempt): void {
            if ($attempt->passed && empty($attempt->certificate_token)) {
                $attempt->certificate_token = (string) Str::uuid();
                $attempt->issued_at = $attempt->issued_at ?? Carbon::now();
            }
        });
    }

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

    public function isValidCertificate(): bool
    {
        return $this->passed && $this->certificate_token && !$this->revoked_at;
    }
}

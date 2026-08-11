<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateAttemptQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_attempt_id',
        'certificate_question_id',
        'options_mapping',
        'selected_option_key',
        'is_correct',
    ];

    protected $casts = [
        'options_mapping' => 'array',
        'is_correct' => 'boolean',
    ];

    public function attempt()
    {
        return $this->belongsTo(CertificateAttempt::class, 'certificate_attempt_id');
    }

    public function question()
    {
        return $this->belongsTo(CertificateQuestion::class, 'certificate_question_id');
    }
}

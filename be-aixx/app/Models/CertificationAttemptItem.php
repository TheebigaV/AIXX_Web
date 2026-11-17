<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CertificationAttemptItem extends Model
{
    protected $fillable = [
        'certification_attempt_id',
        'training_question_id',
        'sort_order',
        'options_mapping',
        'selected_option',
        'is_correct',
    ];

    protected $casts = [
        'options_mapping' => 'array',
        'is_correct' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(TrainingQuestion::class, 'training_question_id');
    }
}

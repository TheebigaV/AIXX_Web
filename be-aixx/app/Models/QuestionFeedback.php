<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionFeedback extends Model
{
    protected $table = 'question_feedback';

    protected $fillable = [
        'student_id',
        'training_question_id',
        'type',
        'comment',
        'status',
    ];
}

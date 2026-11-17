<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssessmentBlueprint extends Model
{
    protected $fillable = [
        'training_id',
        'total_questions',
        'pass_mark',
        'topics',
    ];

    protected $casts = [
        'topics' => 'array',
        'total_questions' => 'integer',
        'pass_mark' => 'integer',
    ];

    public function training()
    {
        return $this->belongsTo(Training::class);
    }
}

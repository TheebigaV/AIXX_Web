<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_id',
        'title',
        'questions',
        'is_active',
    ];

    protected $casts = [
        'questions' => 'array',
        'is_active' => 'boolean',
    ];

    public function training()
    {
        return $this->belongsTo(Training::class);
    }

    public function responses()
    {
        return $this->hasMany(SurveyResponse::class);
    }
}

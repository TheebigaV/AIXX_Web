<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'training_id',
        'question',
        'options',
        'correct_answer_index',
        'explanation',
        'is_active',
    ];

    protected $casts = [
        'options' => 'array',
        'is_active' => 'boolean',
    ];

    public function training()
    {
        return $this->belongsTo(Training::class);
    }
}

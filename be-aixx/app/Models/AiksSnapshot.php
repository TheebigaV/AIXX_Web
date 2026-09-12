<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiksSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'score',
        'level',
        'breakdown',
        'source',
    ];

    protected $casts = [
        'breakdown' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}

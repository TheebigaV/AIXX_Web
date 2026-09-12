<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmbassadorReferral extends Model
{
    use HasFactory;

    protected $fillable = [
        'ambassador_id',
        'referred_student_id',
        'referred_email',
        'status',
        'converted_at',
    ];

    protected $casts = [
        'converted_at' => 'datetime',
    ];

    public function ambassador()
    {
        return $this->belongsTo(Ambassador::class);
    }

    public function referredStudent()
    {
        return $this->belongsTo(Student::class, 'referred_student_id');
    }
}

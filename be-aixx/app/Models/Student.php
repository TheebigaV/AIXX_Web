<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'registration_id',
        'full_name',
        'email',
        'password',
        'last_login_at',
        'gender',
        'company_name',
        'academic_institution',
        'phone',
        'country',
        'passed',
        'test_score',
        'passed_at',
        'enrolled_courses',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'last_login_at' => 'datetime',
        'enrolled_courses' => 'array',
    ];
}

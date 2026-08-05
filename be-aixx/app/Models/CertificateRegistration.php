<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'registration_id',
        'password',
        'full_name',
        'gender',
        'company_name',
        'academic_institution',
        'phone',
        'email',
        'country',
        'test_score',
        'passed',
        'passed_at',
        'last_login_at',
    ];

    protected $casts = [
        'passed' => 'boolean',
        'passed_at' => 'datetime',
        'last_login_at' => 'datetime',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'full_name',
        'gender',
        'company_name',
        'phone',
        'email',
        'country',
        'test_score',
        'passed',
        'passed_at',
    ];

    protected $casts = [
        'passed' => 'boolean',
        'passed_at' => 'datetime',
    ];
}

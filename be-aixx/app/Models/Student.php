<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

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
        'otp_code',
        'otp_expires_at',
        'email_verified_at',
        'preferences',
        'tenant_id',
        'department',
    ];

    protected $hidden = [
        'password',
        'otp_code',
    ];

    protected $casts = [
        'last_login_at' => 'datetime',
        'enrolled_courses' => 'array',
        'otp_expires_at' => 'datetime',
        'email_verified_at' => 'datetime',
        'preferences' => 'array',
        'passed_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function ambassador()
    {
        return $this->hasOne(Ambassador::class);
    }

    public function aiksSnapshots()
    {
        return $this->hasMany(AiksSnapshot::class)->orderByDesc('id');
    }

    public function certificateAttempts()
    {
        return $this->hasMany(CertificateAttempt::class);
    }
}

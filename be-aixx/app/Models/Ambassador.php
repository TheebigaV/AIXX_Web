<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ambassador extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'referral_code',
        'status',
        'commission_rate',
        'joined_at',
    ];

    protected $casts = [
        'commission_rate' => 'decimal:2',
        'joined_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function commissions()
    {
        return $this->hasMany(AmbassadorCommission::class);
    }

    public function referrals()
    {
        return $this->hasMany(AmbassadorReferral::class);
    }
}

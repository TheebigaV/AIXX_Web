<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmbassadorCommission extends Model
{
    use HasFactory;

    protected $fillable = [
        'ambassador_id',
        'amount',
        'currency',
        'source',
        'status',
        'earned_at',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'earned_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function ambassador()
    {
        return $this->belongsTo(Ambassador::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contributor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'bio',
        'expertise',
        'status',
    ];

    public function certificateQuestions()
    {
        return $this->hasMany(CertificateQuestion::class);
    }
}

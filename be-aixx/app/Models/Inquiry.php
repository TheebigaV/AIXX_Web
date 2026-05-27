<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inquiry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'customer_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'message',
        'reply_message',
        'is_viewed',
        'is_replyed',
    ];

    protected $casts = [
        'is_viewed' => 'boolean',
        'is_replyed' => 'boolean',
    ];
}

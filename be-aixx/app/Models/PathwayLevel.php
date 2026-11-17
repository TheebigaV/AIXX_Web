<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PathwayLevel extends Model
{
    protected $fillable = [
        'pathway_slug',
        'pathway_name',
        'level',
        'level_name',
        'description',
        'training_id',
    ];

    protected $casts = [
        'level' => 'integer',
    ];

    public function training()
    {
        return $this->belongsTo(Training::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KnowledgeCheck extends Model
{
    protected $fillable = [
        'training_module_id',
        'lang',
        'sort_order',
        'question',
        'suggested_answer',
    ];

    public function module()
    {
        return $this->belongsTo(TrainingModule::class, 'training_module_id');
    }
}

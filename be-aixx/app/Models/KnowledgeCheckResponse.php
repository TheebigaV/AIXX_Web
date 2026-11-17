<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KnowledgeCheckResponse extends Model
{
    protected $fillable = [
        'student_id',
        'knowledge_check_id',
        'answer',
    ];

    public function knowledgeCheck()
    {
        return $this->belongsTo(KnowledgeCheck::class);
    }
}

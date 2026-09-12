<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class LearningPath extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $path): void {
            if (empty($path->slug)) {
                $path->slug = Str::slug($path->name);
            }
        });
    }

    public function trainings()
    {
        return $this->belongsToMany(Training::class, 'learning_path_training')
            ->withPivot('sort_order')
            ->orderBy('learning_path_training.sort_order');
    }
}

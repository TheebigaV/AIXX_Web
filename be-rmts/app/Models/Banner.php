<?php

namespace App\Models;

use App\Types;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Banner extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'page',
        'title_1',
        'title_2',
        'subtitle',
        'link',
        'is_active',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Banner')
            ->logOnlyDirty();
    }

    /**
     * @return MorphOne
     */
    public function image(): MorphOne
    {
        return $this->morphOne(Document::class, 'documentable')->where('type', Types::Image);
    }
}

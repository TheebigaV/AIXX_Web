<?php

namespace App\Models;

use App\Types;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 *
 */
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * Mass assignable attributes
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'description',
        'is_active',
    ];

    /**
     * Casts
     *
     * @var string[]
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public array $relationable = [
        'category' => ['id', 'name', 'slug'],
    ];

    /**
     * @var array|string[]
     */
    public array $filterable = [
        'name' => 'like',
        'category_id' => '=',
        'slug' => '=',
        'is_active' => '=',
    ];


    /**
     * Activity log options
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Product')
            ->logOnlyDirty();
    }

    /**
     * Category relationship
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return MorphMany
     */
    public function images(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    /**
     * @return MorphOne
     */
    public function mainProductImage(): MorphOne
    {
        return $this->morphOne(Document::class, 'documentable')->where('type', Types::MainProdctImage);
    }

    /**
     * @return MorphMany
     */
    public function subProductImages(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable')->where('type', Types::SubProductImage);
    }
}

<?php

namespace App\Models;

use App\Types;
use App\Models\Document;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Product extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $appends = ['main_product_image', 'sub_product_images'];
    protected $fillable = ['name', 'description', 'category_id', 'is_active', 'slug'];

    // Accessor for main product image URL
    public function getMainProductImageAttribute()
    {
        $doc = $this->mainProductImage()->first();
        if (!$doc) return null;
        if (!$doc->file_name) return null;
        return Storage::disk('public')->url($doc->file_name);
    }

    // Accessor for sub product images collection
    public function getSubProductImagesAttribute()
    {
        return $this->subProductImages()
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'url' => $doc->file_name ? Storage::disk('public')->url($doc->file_name) : null,
                ];
            })
            ->toArray();
    }

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('Product')
            ->logOnlyDirty()
            ->logFillable();
    }



    /**
     * @return BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return MorphOne
     */
    public function mainProductImage(): MorphOne
    {
        return $this->morphOne(Document::class, 'documentable')->where('type', Types::MainProductImage);
    }

    /**
     * @return MorphMany
     */
    public function subProductImages(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable')->where('type', Types::SubProductImage);
    }
}

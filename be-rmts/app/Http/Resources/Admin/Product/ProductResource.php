<?php

namespace App\Http\Resources\Admin\Product;

use App\Http\Resources\Admin\Category\CategoryResource;
use App\Http\Resources\Admin\Document\DocumentCollection;
use App\Http\Resources\Admin\Document\DocumentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'category_id' => $this->category_id,
            'category' => new CategoryResource(optional($this->category)),
            'description' => $this->description,
            'is_active' => $this->is_active,
            'main_product_image' => new DocumentResource($this->mainProductImage),
            'sub_product_images' => new DocumentCollection(optional($this->subProductImages))

        ];
    }
}

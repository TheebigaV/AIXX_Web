<?php

namespace App\Http\Resources\Guest\Category;

use App\Http\Resources\Admin\Document\DocumentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'image'=> new DocumentResource($this->image) ?? null,
            'products_count' => $this->products->count()
        ];
    }
}

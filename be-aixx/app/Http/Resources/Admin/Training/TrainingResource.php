<?php

namespace App\Http\Resources\Admin\Training;

use App\Http\Resources\Admin\Document\DocumentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'image'=> new DocumentResource($this->image) ?? null,
        ];
    }
}

<?php
namespace App\Http\Resources\Guest\Project;

use App\Http\Resources\Admin\Document\DocumentCollection;
use App\Http\Resources\Admin\Document\DocumentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'is_active' => $this->is_active,
            'description' => $this->description,
            'date' => $this->date ? $this->date->format('Y-m-d') : null,
            'thumbnail_image' => new DocumentResource($this->thumbnailImage),
            'images' => new DocumentCollection(optional($this->images))
        ];
    }
}

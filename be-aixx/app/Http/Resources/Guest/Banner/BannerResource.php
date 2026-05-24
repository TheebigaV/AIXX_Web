<?php

namespace App\Http\Resources\Guest\Banner;

use App\Http\Resources\Admin\Document\DocumentResource;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'       => $this->id,
            'title_1'   => $this->title_1,
            'title_2'   => $this->title_2,
            'subtitle' => $this->subtitle,
            'is_active' => $this->is_active,
            'link' => $this->link,
            'image'=> new DocumentResource($this->image) ?? null,
        ];
    }
}

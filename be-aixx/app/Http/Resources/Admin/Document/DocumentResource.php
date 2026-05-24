<?php

namespace App\Http\Resources\Admin\Document;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DocumentResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array|null
    {
        if (!$this->resource) {
            return null;
        }
        
        return [
            'id' => $this->id,
            'url' => Storage::disk('public')->url($this->file_name),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }

}

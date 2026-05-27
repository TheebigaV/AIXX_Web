<?php

namespace App\Http\Resources\Admin\Training;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TrainingCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}

<?php

namespace App\Http\Resources\Auth\RoleAndPermission;

use App\Http\Resources\Auth\RoleAndPermission\Permission\PermissionCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleAndPermissionResource extends JsonResource
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
            'name' => $this->name,
            'permissions' => new PermissionCollection($this->permissions),
        ];
    }
}

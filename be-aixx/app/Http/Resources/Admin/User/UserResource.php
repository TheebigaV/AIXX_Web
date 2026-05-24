<?php

namespace App\Http\Resources\Admin\User;

use App\Http\Resources\Auth\RoleAndPermission\Role\RoleCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'roles' => new RoleCollection(optional($this->roles)),
        ];
    }

}

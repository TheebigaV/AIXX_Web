<?php

namespace App\Http\Requests\Admin\Role;

use App\Models\RoleAndPermission\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * @return string[]
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                Rule::unique(Role::class),
                'max:255'
            ],
            'permission_ids' => [
                'required',
                'array'
            ],
            'permission_ids.*' => [
                'integer',
                'exists:permissions,id'
            ],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\Role;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeleteRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        $role = $this->route('role');
        $this->merge(['id' => $role]);
        return [
            'id' => [
                'required',
                Rule::exists('roles')->where(function ($query) {
                    $query->whereNull('deleted_at');
                }),
                Rule::unique('model_has_roles', 'role_id'),
                Rule::in($role)
            ],
        ];
    }

    /**
     * @return string[]
     */
    public function messages(): array
    {
        return [
            'id.unique' => 'The selected role is assigned to users',
        ];
    }
}

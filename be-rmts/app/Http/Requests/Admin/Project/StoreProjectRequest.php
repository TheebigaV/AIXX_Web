<?php

namespace App\Http\Requests\Admin\Project;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check(); // Handle authorization in controller or middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255'
            ],
            'description' => [
                'required',
                'string',
            ],
            'date' => [
                'required',
                'date'
            ],
            'is_active' => [
                'required',
                'boolean'
            ],
            'thumbnail_image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
//                'dimensions:width=470,height=600'
            ],
            'images' => [
                'nullable',
                'array',
            ],
            'images.*' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif',
//                'dimensions:width=470,height=600'
            ],
        ];
    }
}

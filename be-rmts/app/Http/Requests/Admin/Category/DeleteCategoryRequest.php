<?php

namespace App\Http\Requests\Admin\Category;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeleteCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $category = $this->route('category');
        $this->merge(['id' => $category]);
        return [
            'id' => [
                'required',
                Rule::exists(Category::class)->whereNull('deleted_at'),
            ],
        ];
    }
}

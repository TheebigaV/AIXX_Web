<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('products')->whereNull('deleted_at'),
            ],
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')->whereNull('deleted_at'),
            ],
            'description' => [
                'required',
                'string',
            ],
            'is_active' => [
                'required',
                'boolean',
            ],
            'main_product_image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
//                'dimensions:width=470,height=600'
            ],
            'sub_product_images' => [
                'nullable',
                'array',
            ],
            'sub_product_images.*' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif',
//                'dimensions:width=470,height=600'
            ],


        ];
    }
}

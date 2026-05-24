<?php

namespace App\Http\Requests\Guest\Inquiry;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInquiryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id')->where(function ($query) {
                    $query->whereNull('deleted_at');
                }),
            ],
            'customer_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\pL\s\-\.]+$/u',
            ],
            'customer_email' => [
                'required',
                'email',
                'max:500',
            ],
            'customer_phone' => [
                'required',
                'string',
                'regex:/^\+?[0-9\s\-]{7,20}$/',
            ],
            'message' => [
                'required',
                'string',
                'max:5000',
            ],
        ];
    }
}

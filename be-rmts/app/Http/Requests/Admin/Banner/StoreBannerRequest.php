<?php

namespace App\Http\Requests\Admin\Banner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class StoreBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'title_1' => [
                'required',
                'string',
                'max:255'
            ],
            'title_2' => [
                'nullable',
                'string',
                'max:255'
            ],
            'subtitle' => [
                'nullable',
                'string',
                'max:500'
            ],
            'link' => [
                'nullable',
                'string',
                'max:500'
            ],
            'is_active' => [
                'required',
                'boolean',
            ],

            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
//                'dimensions:width=470,height=600'
            ],
        ];
    }
}

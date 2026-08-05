<?php

namespace App\Http\Requests\Admin\Training;

use App\Models\Training;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTrainingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Training::class)->whereNull('deleted_at'),
            ],
            'type' => [
                'required',
                'string',
                'in:seminars,workshops,courses,certification,newsletters,media_gallery,free_courses,elearning',
            ],
            'description' => [
                'nullable',
                'string',
            ],
            'duration' => [
                'nullable',
                'string',
                'max:255',
            ],
            'sub_modules' => [
                'nullable',
                'string',
            ],
            'domestic_fee' => [
                'nullable',
                'string',
                'max:255',
            ],
            'international_fee' => [
                'nullable',
                'string',
                'max:255',
            ],
            'highlights' => [
                'nullable',
                'string',
            ],
            'is_active' => [
                'nullable',
                'boolean',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif',
            ],
        ];
    }
}

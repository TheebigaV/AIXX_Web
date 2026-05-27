<?php

namespace App\Http\Requests\Admin\Training;

use App\Models\Training;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTrainingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $trainingId = $this->route('training');
        $this->merge(['id' => $trainingId]);

        return [
            'id' => [
                'required',
                Rule::exists(Training::class)->whereNull('deleted_at'),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Training::class)
                    ->ignore($this->id)
                    ->whereNull('deleted_at'),
            ],
            'type' => [
                'required',
                'string',
                'in:seminars,workshops,courses,certification,newsletters',
            ],
            'description' => [
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

<?php

namespace App\Http\Requests\Admin\Banner;

use App\Models\Banner;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class DeleteBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        $bannerId = $this->route('banner');
        $this->merge(['id' => $bannerId]);

        return [
            'id' => [
                'required',
                Rule::exists(Banner::class, 'id')->whereNull('deleted_at'),
            ],
        ];
    }
}

<?php

namespace App\Http\Requests\Accounting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAnalyticalCenterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage accounting');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $analyticalCenterId = $this->route('analytical_center')->id;

        return [
            'analytical_nature_id' => [
                'required',
                'exists:analytical_natures,id',
                \Illuminate\Validation\Rule::unique('analytical_centers')->where(function ($query) {
                    return $query->where('analytical_code_id', $this->analytical_code_id)
                        ->whereNull('deleted_at');
                })->ignore($analyticalCenterId),
            ],
            'analytical_code_id' => ['required', 'exists:analytical_codes,id'],
            'short_name' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ];
    }
}

<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

class StoreProphylaxisProgramRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage prophylaxis');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'animal_type' => ['required', 'string', 'in:pondeuse,chair,porc'],
            'is_active' => ['boolean'],
            'steps' => ['nullable', 'array'],
            'steps.*.day_offset' => ['required', 'integer', 'min:0'],
            'steps.*.medication_category_id' => ['required', 'exists:categories,id'],
            'steps.*.description' => ['nullable', 'string'],
            'steps.*.alert_days_before' => ['required', 'integer', 'min:0'],
        ];
    }
}

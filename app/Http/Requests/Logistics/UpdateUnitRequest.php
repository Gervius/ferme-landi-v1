<?php

namespace App\Http\Requests\Logistics;

use App\Models\Unit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\UnitType;
use Illuminate\Validation\Rules\Enum;

class UpdateUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('unit') ?? new Unit);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'symbol' => ['required', 'string', 'max:50', Rule::unique('units', 'symbol')->ignore($this->route('unit'))],
            'type' => ['required', new Enum(UnitType::class)],
            'is_base_unit' => ['boolean'],
            'base_unit_id' => ['nullable', 'exists:units,id'],
            'conversion_rate' => ['required_if:is_base_unit,false', 'numeric', 'min:0.000001'],
            'is_active' => ['boolean'],
        ];
    }
}

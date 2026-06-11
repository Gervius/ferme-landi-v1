<?php

namespace App\Http\Requests\Logistics;

use App\Models\Unit;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\UnitType;
use Illuminate\Validation\Rules\Enum;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Unit::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'symbol' => ['required', 'string', 'max:50', 'unique:units,symbol'],
            'type' => ['required', new Enum(UnitType::class)],
            'is_base_unit' => ['boolean'],
            'base_unit_id' => ['nullable', 'exists:units,id'],
            'conversion_rate' => ['required_if:is_base_unit,false', 'numeric', 'min:0.000001'],
            'is_active' => ['boolean'],
        ];
    }
}

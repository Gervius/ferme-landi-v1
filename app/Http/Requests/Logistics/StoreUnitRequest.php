<?php

namespace App\Http\Requests\Logistics;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Unit;

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
            'type' => ['required', 'string', 'in:masse,volume,longueur,unitaire,conditionnement'],
            'is_base_unit' => ['boolean'],
            'base_unit_id' => ['nullable', 'exists:units,id'],
            'conversion_rate' => ['required_if:is_base_unit,false', 'numeric', 'min:0.000001'],
            'is_active' => ['boolean'],
        ];
    }
}

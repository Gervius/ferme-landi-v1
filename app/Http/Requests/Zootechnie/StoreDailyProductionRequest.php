<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDailyProductionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('create generations'); // Idéalement 'create daily_productions'
    }

    public function rules(): array
    {
        return [
            'generation_id' => ['required', 'exists:generations,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'item_category_id' => ['nullable', 'exists:categories,id'],
            'good_quantity' => ['required', 'numeric', 'min:0'],
            'broken_quantity' => ['required', 'numeric', 'min:0'],
            
            // 🔴 BOUCLIER ANTI-DOUBLONS (Race Conditions HTTP)
            'date' => [
                'required', 
                'date',
                Rule::unique('daily_productions')->where(function ($query) {
                    return $query->where('generation_id', $this->generation_id)
                                 ->where('item_category_id', $this->item_category_id);
                })
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'date.unique' => 'Une production a déjà été saisie pour ce lot et ce type de produit à cette date.',
        ];
    }
}
<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeedConsumptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('create generations');
    }

    public function rules(): array
    {
        return [
            'generation_id' => ['required', 'exists:generations,id'],
            'item_id' => ['required', 'exists:items,id'], // Remplacé
            'unit_id' => ['required', 'exists:units,id'],
            'quantity' => ['required', 'numeric', 'min:0'],
            
            'date' => [
                'required', 
                'date',
                Rule::unique('feed_consumptions')->where(function ($query) {
                    return $query->where('generation_id', $this->generation_id)
                                 ->where('item_id', $this->item_id); // Remplacé
                })
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'date.unique' => 'Une consommation a déjà été saisie pour ce lot et cet aliment à cette date.',
        ];
    }
}
<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHealthTreatmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('create generations');
    }

    public function rules(): array
    {
        return [
            'generation_id' => ['required', 'exists:generations,id'],
            'disease_description' => ['required', 'string'],
            
            // Nouveaux champs d'inventaire (Optionnels si on n'utilise pas le stock physique)
            'item_id' => ['nullable', 'exists:items,id'],
            'quantity' => ['nullable', 'numeric', 'min:0.01', 'required_with:item_id'],
            'unit_id' => ['nullable', 'exists:units,id', 'required_with:item_id'],
            
            'medication_name' => ['required', 'string', 'max:255'],
            'dosage_description' => ['required', 'string', 'max:255'],
            'veterinarian_name' => ['nullable', 'string', 'max:255'],
            
            'date' => [
                'required', 
                'date',
                Rule::unique('health_treatments')->where(function ($query) {
                    return $query->where('generation_id', $this->generation_id)
                                 ->where('medication_name', $this->medication_name);
                })
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'date.unique' => 'Une intervention avec ce médicament a déjà été enregistrée pour ce lot aujourd\'hui.',
        ];
    }
}
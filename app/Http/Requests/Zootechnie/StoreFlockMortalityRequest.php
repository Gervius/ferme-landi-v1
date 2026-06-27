<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFlockMortalityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('create generations');
    }

    public function rules(): array
    {
        return [
            'generation_id' => ['required', 'exists:generations,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'cause' => ['nullable', 'string', 'max:255'],
            'estimated_financial_loss' => ['nullable', 'numeric', 'min:0'],
            
            // 🔴 BOUCLIER ANTI-DOUBLONS
            // Empêche la création accidentelle de plusieurs fiches de mortalité le même jour pour le même lot
            'date' => [
                'required', 
                'date',
                Rule::unique('flock_mortalities')->where(function ($query) {
                    return $query->where('generation_id', $this->generation_id);
                })
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'date.unique' => 'Un relevé de mortalité a déjà été enregistré pour ce lot à cette date.',
        ];
    }
}
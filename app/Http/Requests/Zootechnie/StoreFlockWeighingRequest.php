<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFlockWeighingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('create generations');
    }

    public function rules(): array
    {
        return [
            'generation_id' => ['required', 'exists:generations,id'],
            'average_weight' => ['required', 'numeric', 'min:0.01'],
            'weighed_subjects_count' => ['required', 'integer', 'min:1'],
            
            // 🔴 BOUCLIER ANTI-DOUBLONS
            // On empêche de saisir plusieurs pesées pour le même lot le même jour
            'date' => [
                'required', 
                'date',
                Rule::unique('flock_weighings')->where(function ($query) {
                    return $query->where('generation_id', $this->generation_id);
                })
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'date.unique' => 'Une pesée a déjà été enregistrée pour ce lot à cette date.',
        ];
    }
}
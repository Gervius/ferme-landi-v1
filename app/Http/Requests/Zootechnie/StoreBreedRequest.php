<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBreedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage breeds');
    }

    public function rules(): array
    {
        return [
            'species_id' => ['required', 'exists:species,id'],
            'name' => [
                'required', 
                'string', 
                'max:255',
                // 🔴 BOUCLIER ANTI-DOUBLONS
                // Empêche de créer deux races portant le même nom pour la même espèce
                Rule::unique('breeds')->where(function ($query) {
                    return $query->where('species_id', $this->species_id);
                })
            ],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Cette race / souche existe déjà pour l\'espèce sélectionnée.',
        ];
    }
}
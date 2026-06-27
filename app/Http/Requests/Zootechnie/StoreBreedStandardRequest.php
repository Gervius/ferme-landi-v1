<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBreedStandardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('edit breeds');
    }

    public function rules(): array
    {
        return [
            // 🔴 BOUCLIER ANTI-DOUBLONS : Une race ne peut avoir qu'UN SEUL standard.
            'breed_id' => [
                'required', 
                'exists:breeds,id',
                Rule::unique('breed_standards', 'breed_id')
            ],
            'target_laying_start_age' => ['required', 'integer', 'min:0'],
            'target_culling_age' => ['required', 'integer', 'min:0', 'gte:target_laying_start_age'],
            'peak_laying_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'target_daily_feed_intake' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'breed_id.unique' => 'Un standard de performance a déjà été défini pour cette race. Veuillez le modifier plutôt que d\'en créer un nouveau.',
        ];
    }
}
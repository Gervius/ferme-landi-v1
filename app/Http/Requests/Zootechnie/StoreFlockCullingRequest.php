<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFlockCullingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('create generations');
    }

    public function rules(): array
    {
        return [
            'generation_id' => ['required', 'exists:generations,id'],
            'quantity_culled' => ['required', 'numeric', 'min:1'],
            'reason' => ['nullable', 'string', 'max:255'],
            
            // 🔴 BOUCLIER ANTI-DOUBLONS (Race Conditions HTTP)
            // On empêche de saisir plusieurs réformes pour le même lot à la même date
            'date' => [
                'required', 
                'date',
                Rule::unique('flock_cullings')->where(function ($query) {
                    return $query->where('generation_id', $this->generation_id);
                })
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'date.unique' => 'Une réforme a déjà été déclarée pour ce lot à cette date.',
        ];
    }
}
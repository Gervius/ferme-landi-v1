<?php

namespace App\Http\Requests\Zootechnie;

use App\Enums\GenerationType;
use App\Models\Generation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGenerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Generation::class);
    }

    public function rules(): array
    {
        return [
            'site_id' => ['required', 'exists:sites,id'],
            'breed_id' => ['required', 'exists:breeds,id'],
            'type' => ['required', Rule::enum(GenerationType::class)], // Sécurité absolue
            'start_date' => ['required', 'date'],
            'initial_quantity' => ['required', 'integer', 'min:1'],
            'observation' => ['nullable', 'string'], // Corrigé : c'est nullable en base de données
        ];
    }
}
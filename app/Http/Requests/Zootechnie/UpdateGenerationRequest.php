<?php

namespace App\Http\Requests\Zootechnie;

use App\Enums\GenerationStatus;
use App\Models\Generation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGenerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('generation'));
    }

    public function rules(): array
    {
        // On récupère l'instance actuelle pour la validation contextuelle
        /** @var Generation $generation */
        $generation = $this->route('generation');

        return [
            // BANNIS : site_id, breed_id, type, start_date, initial_quantity.
            // S'ils sont envoyés, ils seront ignorés par Laravel car non définis ici.

            'current_quantity' => [
                'sometimes', // Seulement si présent dans la requête
                'required',
                'integer',
                'min:0',
                'lte:' . $generation->initial_quantity // Règle d'or : impossible d'avoir plus d'animaux vivants qu'au démarrage
            ],

            'status' => [
                'sometimes',
                'required',
                Rule::enum(GenerationStatus::class) // Verrouillage strict PHP 8.4+
            ],

            'observation' => [
                'nullable',
                'string'
            ],
        ];
    }
}
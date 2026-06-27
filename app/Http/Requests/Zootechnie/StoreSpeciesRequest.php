<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

class StoreSpeciesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage breeds'); // Use manage breeds permission
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:species,name'], // 🔴 BOUCLIER ANTI-DOUBLONS (On ne veut qu'un seul 'Poulet' ou 'Porc')
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Cette espèce existe déjà dans le système.',
        ];
    }
}
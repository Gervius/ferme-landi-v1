<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

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
            'date' => ['required', 'date'],
            'disease_description' => ['required', 'string'],
            'medication_name' => ['required', 'string', 'max:255'],
            'dosage_description' => ['required', 'string', 'max:255'],
            'veterinarian_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}

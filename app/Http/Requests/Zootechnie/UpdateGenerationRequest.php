<?php

namespace App\Http\Requests\Zootechnie;

use App\Models\Generation;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGenerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('generation'));
    }

    public function rules(): array
    {
        return [
            'site_id' => ['required', 'exists:sites,id'],
            'breed_id' => ['required', 'exists:breeds,id'],
            'type' => ['required', 'string', 'in:pondeuse,chair,porc'],
            'start_date' => ['required', 'date'],
            'initial_quantity' => ['required', 'integer', 'min:1'],
            'current_quantity' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'string'],
            'observation' => ['nullable', 'string'],
        ];
    }
}

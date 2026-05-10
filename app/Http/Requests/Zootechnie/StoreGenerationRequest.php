<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Generation;

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
            'type' => ['required', 'string', 'in:pondeuse,chair,porc'],
            'start_date' => ['required', 'date'],
            'initial_quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}

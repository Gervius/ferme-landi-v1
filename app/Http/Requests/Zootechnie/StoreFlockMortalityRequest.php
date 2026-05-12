<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

class StoreFlockMortalityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'generation_id' => ['required', 'exists:generations,id'],
            'date' => ['required', 'date'],
            'quantity' => ['required', 'integer', 'min:1'],
            'cause' => ['nullable', 'string', 'max:255'],
            'estimated_financial_loss' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}

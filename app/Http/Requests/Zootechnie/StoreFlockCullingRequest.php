<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

class StoreFlockCullingRequest extends FormRequest
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
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }
}

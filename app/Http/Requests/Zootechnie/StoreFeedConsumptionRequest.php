<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeedConsumptionRequest extends FormRequest
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
            'item_category_id' => ['required', 'exists:categories,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'quantity' => ['required', 'numeric', 'min:0'],
        ];
    }
}

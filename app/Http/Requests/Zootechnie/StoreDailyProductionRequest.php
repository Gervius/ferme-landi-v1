<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyProductionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // We use Gate in controller
    }

    public function rules(): array
    {
        return [
            'generation_id' => ['required', 'exists:generations,id'],
            'date' => ['required', 'date'],
            'unit_id' => ['required', 'exists:units,id'],
            'item_category_id' => ['nullable', 'exists:categories,id'],
            'good_quantity' => ['required', 'numeric', 'min:0'],
            'broken_quantity' => ['required', 'numeric', 'min:0'],
        ];
    }
}

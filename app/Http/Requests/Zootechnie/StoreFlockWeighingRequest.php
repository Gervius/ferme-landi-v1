<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

class StoreFlockWeighingRequest extends FormRequest
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
            'average_weight' => ['required', 'numeric', 'min:0.01'],
            'weighed_subjects_count' => ['required', 'integer', 'min:1'],
        ];
    }
}

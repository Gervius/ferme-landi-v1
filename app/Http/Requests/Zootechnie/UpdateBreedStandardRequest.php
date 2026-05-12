<?php

namespace App\Http\Requests\Zootechnie;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBreedStandardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('edit breeds');
    }

    public function rules(): array
    {
        return [
            'breed_id' => ['required', 'exists:breeds,id'],
            'target_laying_start_age' => ['required', 'integer', 'min:0'],
            'target_culling_age' => ['required', 'integer', 'min:0', 'gte:target_laying_start_age'],
            'peak_laying_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'target_daily_feed_intake' => ['required', 'numeric', 'min:0'],
        ];
    }
}

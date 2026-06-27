<?php

namespace App\Http\Requests\Logistics;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UpdateItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('update', $this->route('item'));
    }

    public function rules(): array
    {
        return [
            'category_id'     => ['required', 'exists:categories,id'],
            'default_unit_id' => ['required', 'exists:units,id'],
            'name'            => [
                'required', 
                'string', 
                'max:255', 
                Rule::unique('items', 'name')->ignore($this->route('item')->id)
            ],
            'is_perishable'   => ['boolean'],
            'manage_by_batch' => ['boolean'],
            'is_active'       => ['boolean'],
        ];
    }
}
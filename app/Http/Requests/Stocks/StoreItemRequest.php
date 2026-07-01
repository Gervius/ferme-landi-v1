<?php

namespace App\Http\Requests\Stocks;

use App\Models\Item;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', Item::class);
    }

    public function rules(): array
    {
        return [
            'category_id'     => ['required', 'exists:categories,id'],
            'default_unit_id' => ['required', 'exists:units,id'],
            'name'            => ['required', 'string', 'max:255', 'unique:items,name'],
            'is_perishable'   => ['boolean'],
            'manage_by_batch' => ['boolean'],
            'is_active'       => ['boolean'],
        ];
    }
}
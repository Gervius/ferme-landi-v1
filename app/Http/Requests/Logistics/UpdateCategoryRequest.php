<?php

namespace App\Http\Requests\Logistics;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('category') ?? new Category);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($this->route('category'))],
            'scope' => ['required', 'string', 'in:inventory,animal,finance,equipment'],
            'parent_id' => ['nullable', 'exists:categories,id', Rule::notIn([$this->route('category')?->id])],
            'is_active' => ['boolean'],
        ];
    }
}

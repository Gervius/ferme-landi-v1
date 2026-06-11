<?php

namespace App\Http\Requests\Logistics;

use App\Models\Category;
use App\Enums\CategoryScope;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

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
            // On applique la même sécurité absolue ici
            'scope' => ['required', new Enum(CategoryScope::class)],
            'parent_id' => ['nullable', 'exists:categories,id', Rule::notIn([$this->route('category')?->id])],
            'analytical_code_id' => ['nullable', 'exists:analytical_codes,id'],
            'is_active' => ['boolean'],
        ];
    }
}
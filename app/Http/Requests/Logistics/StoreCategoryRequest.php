<?php

namespace App\Http\Requests\Logistics;

use App\Models\Category;
use App\Enums\CategoryScope;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Category::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug'],
            // On force Laravel à lire directement ton fichier Enum !
            'scope' => ['required', new Enum(CategoryScope::class)],
            'parent_id' => ['nullable', 'exists:categories,id'],
            'analytical_code_id' => ['nullable', 'exists:analytical_codes,id'],
            'is_active' => ['boolean'],
        ];
    }
}
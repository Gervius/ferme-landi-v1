<?php

namespace App\Http\Requests\Logistics;

use App\Models\Site;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Site::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_id' => ['required', 'exists:companies,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:255', 'unique:sites,code'],
            'type' => ['required', 'string', 'in:ferme_avicole,ferme_porcine,usine_transformation,entrepot,bureau'],
            'address' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}

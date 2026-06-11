<?php

namespace App\Http\Requests\Logistics;

use App\Models\Site;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\SiteType;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateSiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('site') ?? new Site);
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
            'code' => ['nullable', 'string', 'max:255', Rule::unique('sites', 'code')->ignore($this->route('site'))],
            'type'       => ['required', new Enum(SiteType::class)],
            'address' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}

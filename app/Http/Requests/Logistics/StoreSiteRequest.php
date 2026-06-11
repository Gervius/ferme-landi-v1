<?php

namespace App\Http\Requests\Logistics;

use App\Models\Site;
use App\Enums\SiteType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreSiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Site::class);
    }

    public function rules(): array
    {
        return [
            'company_id' => ['required', 'exists:companies,id'],
            'name'       => ['required', 'string', 'max:255'],
            'code'       => ['nullable', 'string', 'max:255', 'unique:sites,code'],
            // Validation stricte et dynamique via l'Enum
            'type'       => ['required', new Enum(SiteType::class)], 
            'address'    => ['nullable', 'string'],
            'is_active'  => ['boolean'],
        ];
    }
}

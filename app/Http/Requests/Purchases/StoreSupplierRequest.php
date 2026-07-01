<?php

namespace App\Http\Requests\Purchases;

use App\Models\Supplier;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', Supplier::class);
    }

    public function rules(): array
    {
        return [
            // 🛡️ HTTP-Layer Shield : Unicité du nom et du téléphone
            'name'           => ['required', 'string', 'max:255', 'unique:suppliers,name'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone'          => ['required', 'string', 'max:255', 'unique:suppliers,phone'],
            'email'          => ['nullable', 'email', 'max:255'],
            'address'        => ['nullable', 'string'],
            'is_active'      => ['boolean'],
        ];
    }
}
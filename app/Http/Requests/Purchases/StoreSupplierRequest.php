<?php

namespace App\Http\Requests\Purchases;

use App\Models\Supplier;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', Supplier::class);
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone'          => ['required', 'string', 'max:255'],
            'email'          => ['nullable', 'email', 'max:255'],
            'address'        => ['nullable', 'string'],
            'is_active'      => ['boolean'],
        ];
    }
}

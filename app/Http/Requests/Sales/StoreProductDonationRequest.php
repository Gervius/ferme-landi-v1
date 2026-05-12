<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage sales');
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'beneficiary_name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'valorization_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}

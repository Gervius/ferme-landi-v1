<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage sales');
    }

    public function rules(): array
    {
        return [
            'site_id' => ['required', 'exists:sites,id'],
            'date' => ['required', 'date'],
            'beneficiary_name' => [
                'required', 'string', 'max:255',
                Rule::unique('product_donations')->where(fn ($query) => 
                    $query->where('site_id', $this->site_id)
                          ->where('date', $this->date)
                          ->where('item_id', $this->item_id)
                )
            ],
            'item_id' => ['required', 'exists:items,id'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'valorization_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}

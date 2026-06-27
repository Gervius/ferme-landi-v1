<?php

namespace App\Http\Requests\Purchases;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdatePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('update', $this->route('purchase_order'));
    }

    public function rules(): array
    {
        return [
            'supplier_id'          => ['required', 'exists:suppliers,id'],
            'order_date'           => ['required', 'date'],

            
            'items'                => ['required', 'array', 'min:1'],
            'items.*.item_id'      => ['required', 'exists:items,id'], 
            'items.*.unit_id'      => ['required', 'exists:units,id'],
            'items.*.quantity'     => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price'   => ['required', 'numeric', 'min:0'],
        ];
    }
}
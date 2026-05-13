<?php

namespace App\Http\Requests\Purchases;

use App\Models\PurchaseOrder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StorePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', PurchaseOrder::class);
    }

    public function rules(): array
    {
        return [
            'supplier_id'          => ['required', 'exists:suppliers,id'],
            'order_date'           => ['required', 'date'],
            'reference'            => ['required', 'string', 'max:255', 'unique:purchase_orders,reference'],
            'items'                => ['required', 'array', 'min:1'],
            'items.*.category_id'  => ['required', 'exists:categories,id'],
            'items.*.unit_id'      => ['required', 'exists:units,id'],
            'items.*.quantity'     => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price'   => ['required', 'numeric', 'min:0'],
        ];
    }
}

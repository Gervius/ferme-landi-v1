<?php

namespace App\Http\Requests\Purchases;

use App\Models\PurchaseReceipt;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StorePurchaseReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', PurchaseReceipt::class);
    }

    public function rules(): array
    {
        return [
            'site_id'                       => ['required', 'exists:sites,id'],
            'purchase_order_id'             => ['nullable', 'exists:purchase_orders,id'],
            'receipt_date'                  => ['required', 'date'],
            'reference'                     => ['required', 'string', 'max:255', 'unique:purchase_receipts,reference'],
            'items'                         => ['required', 'array', 'min:1'],
            'items.*.purchase_order_item_id'=> ['nullable', 'exists:purchase_order_items,id'],
            'items.*.category_id'           => ['required', 'exists:categories,id'],
            'items.*.unit_id'               => ['required', 'exists:units,id'],
            'items.*.received_quantity'     => ['required', 'numeric', 'min:0.01'],
        ];
    }
}

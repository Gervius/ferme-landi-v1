<?php

namespace App\Http\Requests\Purchases;

use App\Models\PurchaseReceipt;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StorePurchaseReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', PurchaseReceipt::class);
    }

    public function rules(): array
    {
        return [
            'site_id' => [
                'required', 
                'exists:sites,id',
                // 🛡️ Bouclier HTTP Anti-Doublon
                Rule::unique('purchase_receipts')->where(function ($query) {
                    return $query->where('purchase_order_id', $this->input('purchase_order_id'))
                                 ->where('receipt_date', $this->input('receipt_date'));
                })
            ],
            'purchase_order_id'             => ['nullable', 'exists:purchase_orders,id'],
            'receipt_date'                  => ['required', 'date'],
            
            'items'                         => ['required', 'array', 'min:1'],
            'items.*.purchase_order_item_id'=> ['nullable', 'exists:purchase_order_items,id'],
            'items.*.item_id'               => ['required', 'exists:items,id'], // Remplace category_id
            'items.*.unit_id'               => ['required', 'exists:units,id'],
            'items.*.received_quantity'     => ['required', 'numeric', 'min:0.01'],
        ];
    }

    public function messages(): array
    {
        return [
            'site_id.unique' => 'Un bon de réception a déjà été généré pour cette commande à cette date.',
        ];
    }
}
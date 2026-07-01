<?php

namespace App\Http\Requests\Purchases;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class UpdatePurchaseReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        // On vérifie que l'utilisateur a le droit de modifier ce bon spécifique
        return Gate::allows('update', $this->route('purchase_receipt'));
    }

    public function rules(): array
    {
        return [
            'site_id'                       => ['required', 'exists:sites,id'],
            'purchase_order_id'             => ['nullable', 'exists:purchase_orders,id'],
            'receipt_date'                  => ['required', 'date'],
            
            // Validation stricte des lignes matérielles
            'items'                         => ['required', 'array', 'min:1'],
            'items.*.purchase_order_item_id'=> ['nullable', 'exists:purchase_order_items,id'],
            'items.*.item_id'               => ['required', 'exists:items,id'],
            'items.*.unit_id'               => ['required', 'exists:units,id'],
            'items.*.received_quantity'     => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
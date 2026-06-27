<?php

namespace App\Http\Requests\Purchases;

use App\Models\SupplierInvoice;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreSupplierInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', SupplierInvoice::class);
    }

    public function rules(): array
    {
        return [
            'supplier_id'              => ['required', 'exists:suppliers,id'],
            // 🛡️ Le bouclier était déjà parfait ici
            'purchase_receipt_id'      => ['required', 'exists:purchase_receipts,id', 'unique:supplier_invoices,purchase_receipt_id'],
            'invoice_date'             => ['required', 'date'],
            'due_date'                 => ['nullable', 'date'],
            
            'items'                    => ['required', 'array', 'min:1'],
            'items.*.purchase_receipt_item_id' => ['nullable', 'exists:purchase_receipt_items,id'],
            'items.*.description'      => ['nullable', 'string'],
            'items.*.quantity'         => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price'       => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'purchase_receipt_id.unique' => 'Une facture existe déjà pour ce bon de réception.',
        ];
    }
}
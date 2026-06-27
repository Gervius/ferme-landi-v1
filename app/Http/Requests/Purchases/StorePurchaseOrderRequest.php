<?php

namespace App\Http\Requests\Purchases;

use App\Models\PurchaseOrder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StorePurchaseOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', PurchaseOrder::class);
    }

    public function rules(): array
    {
        return [
            'site_id' => [
                'required', 
                'exists:sites,id',
                // 🛡️ Bouclier HTTP Anti-Doublon
                Rule::unique('purchase_orders')->where(function ($query) {
                    return $query->where('supplier_id', $this->input('supplier_id'))
                                 ->where('order_date', $this->input('order_date'));
                })
            ],
            'supplier_id'          => ['required', 'exists:suppliers,id'],
            'order_date'           => ['required', 'date'],
            // Le champ 'reference' est supprimé car auto-généré par PostgreSQL
            
            'items'                => ['required', 'array', 'min:1'],
            'items.*.item_id'      => ['required', 'exists:items,id'], // Remplace category_id
            'items.*.unit_id'      => ['required', 'exists:units,id'],
            'items.*.quantity'     => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price'   => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'site_id.unique' => 'Une commande identique pour ce fournisseur sur ce site a déjà été enregistrée à cette date. Opération bloquée pour éviter les doublons.',
        ];
    }
}
<?php

namespace App\Http\Requests\Purchases;

use App\Models\SupplierPayment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StoreSupplierPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', SupplierPayment::class);
    }

    public function rules(): array
    {
        return [
            'supplier_id' => [
                'required', 
                'exists:suppliers,id',
                // 🛡️ Bouclier HTTP Anti-Doublon de Paiement
                Rule::unique('supplier_payments')->where(function ($query) {
                    return $query->where('amount', $this->input('amount'))
                                 ->where('payment_date', $this->input('payment_date'))
                                 ->where('payment_method', $this->input('payment_method'));
                })
            ],
            'payment_date'   => ['required', 'date'],
            'amount'         => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string', 'in:especes,cheque,virement,mobile_money'],
            'notes'          => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'supplier_id.unique' => 'Un paiement identique (même montant et même méthode) a déjà été enregistré pour ce fournisseur aujourd\'hui.',
        ];
    }
}
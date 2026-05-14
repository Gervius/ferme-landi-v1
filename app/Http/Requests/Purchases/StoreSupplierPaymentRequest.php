<?php

namespace App\Http\Requests\Purchases;

use App\Models\SupplierPayment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreSupplierPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', SupplierPayment::class);
    }

    public function rules(): array
    {
        return [
            'supplier_id'    => ['required', 'exists:suppliers,id'],
            'payment_date'   => ['required', 'date'],
            'reference'      => ['required', 'string', 'max:255', 'unique:supplier_payments,reference'],
            'amount'         => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string', 'in:especes,cheque,virement,mobile_money'],
            'notes'          => ['nullable', 'string'],
        ];
    }
}

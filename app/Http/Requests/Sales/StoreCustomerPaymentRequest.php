<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage sales');
    }

    public function rules(): array
    {
        return [
            'site_id' => ['required', 'exists:sites,id'],
            'customer_id' => [
                'required', 'exists:customers,id',
                Rule::unique('customer_payments')->where(fn ($query) => 
                    $query->where('site_id', $this->site_id)
                          ->where('payment_date', $this->payment_date)
                          ->where('amount', $this->amount)
                )
            ],
            'payment_date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string', 'in:especes,cheque,virement,mobile_money'],
            'notes' => ['nullable', 'string'],
        ];
        
    }
}

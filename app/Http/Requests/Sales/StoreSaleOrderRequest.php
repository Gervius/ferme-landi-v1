<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleOrderRequest extends FormRequest
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
                Rule::unique('sale_orders')->where(fn ($query) => 
                    $query->where('site_id', $this->site_id)
                          ->where('order_date', $this->order_date)
                )
            ],
            'order_date' => ['required', 'date'],
            // La 'reference' est supprimée car générée par PostgreSQL
            'items' => ['required', 'array', 'min:1'],
            'items.*.item_id' => ['required', 'exists:items,id'], // Remplacement strict de category_id/unit_id
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }
}

<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDeliveryNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage sales');
    }

    public function rules(): array
    {
        return [
            'site_id' => ['required', 'exists:sites,id'],
            'sale_order_id' => [
                'nullable', 'exists:sale_orders,id',
                Rule::unique('delivery_notes')->where(fn ($query) => 
                    $query->where('site_id', $this->site_id)
                          ->where('delivery_date', $this->delivery_date)
                )
            ],
            'delivery_date' => ['required', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.sale_order_item_id' => ['nullable', 'exists:sale_order_items,id'],
            'items.*.item_id' => ['required', 'exists:items,id'], // Remplacement strict
            'items.*.delivered_quantity' => ['required', 'numeric', 'min:0.01'],
        ];
        
    }
}

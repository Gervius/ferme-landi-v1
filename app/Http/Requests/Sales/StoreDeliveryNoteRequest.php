<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;

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
            'sale_order_id' => ['nullable', 'exists:sale_orders,id'],
            'delivery_date' => ['required', 'date'],
            'reference' => ['required', 'string', 'unique:delivery_notes,reference'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.sale_order_item_id' => ['nullable', 'exists:sale_order_items,id'],
            'items.*.category_id' => ['required', 'exists:categories,id'],
            'items.*.unit_id' => ['required', 'exists:units,id'],
            'items.*.delivered_quantity' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}

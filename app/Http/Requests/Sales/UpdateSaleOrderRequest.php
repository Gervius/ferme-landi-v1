<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSaleOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage sales');
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:draft,validated,partially_delivered,delivered,closed'],
        ];
    }
}

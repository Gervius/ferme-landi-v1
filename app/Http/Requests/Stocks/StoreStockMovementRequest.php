<?php

namespace App\Http\Requests\Stocks;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStockMovementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage stocks');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'site_id' => [
                'required', 
                'exists:sites,id',
                // 🛡️ HTTP-Layer Shield : Rejet strict des doublons exacts
                Rule::unique('stock_movements')->where(function ($query) {
                    return $query->where('item_id', $this->input('item_id'))
                                 ->where('date', $this->input('date'))
                                 ->where('quantity', $this->input('quantity'))
                                 ->where('type', $this->input('type'))
                                 ->where('unit_id', $this->input('unit_id'));
                })
            ],
            'item_id' => ['required', 'exists:items,id'], // Remplace category_id
            'unit_id' => ['required', 'exists:units,id'],
            // Ajout du type 'in' pour permettre les entrées de stock
            'type' => ['required', 'string', 'in:in,out,adjustment'],
            'quantity' => ['required', 'numeric', 'min:0.01'], // Évite les mouvements à zéro
            'date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Messages de validation personnalisés.
     */
    public function messages(): array
    {
        return [
            'site_id.unique' => 'Un mouvement identique (même article, date, quantité et type) a déjà été enregistré pour ce site. Opération bloquée pour éviter les doublons.',
        ];
    }
}
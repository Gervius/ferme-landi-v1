<?php

namespace App\Http\Requests\Accounting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAccountingEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('manage accounting');
    }

    public function rules(): array
    {
        return [
            'financial_year_id' => ['required', 'exists:financial_years,id'],
            'accounting_journal_id' => ['required', 'exists:accounting_journals,id'],
            'date' => ['required', 'date'],
            'description' => ['required', 'string'],

            'lines' => ['required', 'array', 'min:2'],
            'lines.*.account_id' => ['required', 'exists:accounts,id'],
            'lines.*.analytical_center_id' => ['nullable', 'exists:analytical_centers,id'],
            // Sécurité mathématique : Entiers stricts (FCFA bruts)
            'lines.*.debit' => ['required', 'integer', 'min:0'],
            'lines.*.credit' => ['required', 'integer', 'min:0'],
            'lines.*.description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
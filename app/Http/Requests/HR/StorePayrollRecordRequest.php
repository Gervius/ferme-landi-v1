<?php

namespace App\Http\Requests\HR;

use App\Models\PayrollRecord;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StorePayrollRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', PayrollRecord::class);
    }

    public function rules(): array
    {
        return [
            'employee_id'      => ['required', 'exists:employees,id'],
            'month'            => ['required', 'integer', 'min:1', 'max:12'],
            'year'             => ['required', 'integer', 'min:2000'],
            'deductions'       => ['nullable', 'numeric', 'min:0'],
            'deduction_reason' => [
                Rule::requiredIf(fn () => $this->input('deductions', 0) > 0),
                'nullable',
                'string',
                'max:255'
            ],
        ];
    }
}

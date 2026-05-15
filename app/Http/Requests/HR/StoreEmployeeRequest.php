<?php

namespace App\Http\Requests\HR;

use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', Employee::class);
    }

    public function rules(): array
    {
        return [
            'site_id'     => ['required', 'exists:sites,id'],
            'first_name'  => ['required', 'string', 'max:255'],
            'last_name'   => ['required', 'string', 'max:255'],
            'base_salary' => ['required', 'numeric', 'min:0'],
            'is_active'   => ['boolean'],
        ];
    }
}

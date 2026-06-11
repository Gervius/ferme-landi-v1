<?php

namespace App\Actions\HR;

use App\Models\Employee;
use Illuminate\Support\Facades\DB;

final readonly class UpdateEmployeeAction
{
    public function execute(Employee $employee, array $data): Employee
    {
        return DB::transaction(function () use ($employee, $data) {
            $employee->update($data);
            return $employee;
        });
    }
}
<?php

namespace App\Actions\HR;

use App\Models\Employee;
use App\Models\PayrollRecord;
use Illuminate\Support\Facades\DB;

class LogPayrollAction
{
    public function execute(array $data, int $userId): PayrollRecord
    {
        return DB::transaction(function () use ($data, $userId) {
            $employee = Employee::findOrFail($data['employee_id']);
            $deductions = $data['deductions'] ?? 0;
            $netSalary = max(0, $employee->base_salary - $deductions);

            return PayrollRecord::create([
                'employee_id'          => $employee->id,
                'month'                => $data['month'],
                'year'                 => $data['year'],
                'base_salary_snapshot' => $employee->base_salary,
                'deductions'           => $deductions,
                'deduction_reason'     => $data['deduction_reason'] ?? null,
                'net_salary'           => $netSalary,
                'status'               => 'draft',
                'prepared_by'          => $userId,
            ]);
        });
    }
}

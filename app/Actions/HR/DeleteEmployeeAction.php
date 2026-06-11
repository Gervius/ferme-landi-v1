<?php

namespace App\Actions\HR;

use App\Models\Employee;
use Illuminate\Support\Facades\DB;

final readonly class DeleteEmployeeAction
{
    public function execute(Employee $employee): void
    {
        DB::transaction(function () use ($employee) {
            $employee->delete();
        });
    }
}
<?php

namespace App\Actions\HR;

use App\Models\Employee;
use Illuminate\Support\Facades\DB;

final readonly class CreateEmployeeAction
{
    public function execute(array $data): Employee
    {
        return DB::transaction(function () use ($data) {
            return Employee::create($data);
        });
    }
}
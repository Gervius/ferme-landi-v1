<?php

namespace App\Actions\HR;

use App\Models\PayrollRecord;
use Illuminate\Support\Facades\DB;

class ApprovePayrollAction
{
    public function execute(PayrollRecord $payrollRecord, int $userId): PayrollRecord
    {
        return DB::transaction(function () use ($payrollRecord, $userId) {
            $payrollRecord->update([
                'status' => 'paid',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            return $payrollRecord;
        });
    }
}

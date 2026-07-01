<?php

namespace App\Actions\HR;

use App\Actions\Accounting\MapAndLogAccountingEntryAction;
use App\Models\AccountingMapping;
use App\Models\AnalyticalCenter;
use App\Models\PayrollRecord;
use Illuminate\Support\Facades\DB;

final readonly class ApprovePayrollRecordAction
{
    public function __construct(
        private MapAndLogAccountingEntryAction $mapAndLogAccountingEntryAction
    ) {}

    public function execute(PayrollRecord $payrollRecord, int $userId): PayrollRecord
    {
        // Chargement du code analytique de l'employé
        $payrollRecord->loadMissing('employee:id,analytical_code_id');

        return DB::transaction(function () use ($payrollRecord, $userId) {
            $payrollRecord->update([
                'status' => 'approved',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            $payrollDate = $payrollRecord->period_start ?? now();
            
            $mapping = AccountingMapping::where('event_type', 'payroll')->firstOrFail();
            
            $analyticalCodeId = $payrollRecord->employee?->analytical_code_id;
            $centerId = $analyticalCodeId 
                ? AnalyticalCenter::where('analytical_nature_id', $mapping->analytical_nature_id)
                    ->where('analytical_code_id', $analyticalCodeId)
                    ->value('id')
                : null;

            $movements = [];

            // 1. Charge salariale de base (Débit)
            $movements[] = [
                'type' => 'debit',
                'amount' => (int) $payrollRecord->base_salary_snapshot,
                'analytical_center_id' => $centerId, 
            ];

            // 2. Salaire net à payer à l'employé (Crédit)
            $movements[] = [
                'type' => 'credit',
                'amount' => (int) $payrollRecord->net_salary,
                'analytical_center_id' => null,
            ];

            // 3. Déductions consensuelles (Crédit - Avances manuellement validées au préalable)
            if ($payrollRecord->deductions > 0) {
                $movements[] = [
                    'type' => 'credit',
                    'amount' => (int) $payrollRecord->deductions,
                    'analytical_center_id' => null,
                ];
            }

            $this->mapAndLogAccountingEntryAction->execute(
                eventType: 'payroll',
                reference: 'PAIE-' . ($payrollRecord->employee_id ?? 'X') . '-' . $payrollDate->format('Y-m'),
                description: 'Fiche de paie ' . $payrollRecord->id,
                date: $payrollDate->format('Y-m-d'),
                movements: $movements
            );

            return $payrollRecord;
        });
    }
}
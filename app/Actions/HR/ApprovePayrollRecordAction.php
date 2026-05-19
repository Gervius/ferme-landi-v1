<?php

namespace App\Actions\HR;

use App\Actions\Accounting\LogAccountingEntryAction;
use App\Models\Account;
use App\Models\AccountingJournal;
use App\Models\AnalyticalCenter;
use App\Models\AnalyticalNature;
use App\Models\FinancialYear;
use App\Models\PayrollRecord;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApprovePayrollRecordAction
{
    public function __construct(
        private readonly LogAccountingEntryAction $logAccountingEntryAction
    ) {
    }

    public function execute(PayrollRecord $payrollRecord, int $userId): PayrollRecord
    {
        return DB::transaction(function () use ($payrollRecord, $userId) {
            $payrollRecord->update([
                'status' => 'approved',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            $payrollDate = $payrollRecord->period_start ?? now();

            $financialYear = FinancialYear::where('is_closed', false)
                ->where('start_date', '<=', $payrollDate)
                ->where('end_date', '>=', $payrollDate)
                ->first();

            if (! $financialYear) {
                throw ValidationException::withMessages([
                    'period' => 'Aucun exercice comptable actif trouvé pour la date de cette paie.',
                ]);
            }

            $journal = AccountingJournal::where('code', AccountingJournal::CODE_PAYROLL)->firstOrFail();

            $expenseAccount = Account::where('number', Account::CODE_SALARIES_EXPENSE)->firstOrFail();
            $payableAccount = Account::where('number', Account::CODE_SALARIES_PAYABLE)->firstOrFail();
            $advancesAccount = Account::where('number', Account::CODE_SALARIES_ADVANCES)->firstOrFail();

            $payrollNature = AnalyticalNature::where('code', AnalyticalNature::CODE_PAYROLL)->firstOrFail();

            $lines = [];

            $centerId = null;
            if ($payrollRecord->employee && $payrollRecord->employee->analytical_code_id) {
                $center = AnalyticalCenter::where('analytical_nature_id', $payrollNature->id)
                    ->where('analytical_code_id', $payrollRecord->employee->analytical_code_id)
                    ->first();

                if ($center) {
                    $centerId = $center->id;
                }
            }

            $lines[] = [
                'account_id' => $expenseAccount->id,
                'debit' => $payrollRecord->base_salary,
                'credit' => 0,
                'analytical_center_id' => $centerId,
            ];

            $lines[] = [
                'account_id' => $payableAccount->id,
                'debit' => 0,
                'credit' => $payrollRecord->net_salary,
                'analytical_center_id' => null,
            ];

            if ($payrollRecord->deductions > 0) {
                $lines[] = [
                    'account_id' => $advancesAccount->id,
                    'debit' => 0,
                    'credit' => $payrollRecord->deductions,
                    'analytical_center_id' => null,
                ];
            }

            $entryData = [
                'financial_year_id' => $financialYear->id,
                'accounting_journal_id' => $journal->id,
                'date' => $payrollDate->format('Y-m-d'),
                'reference' => 'PAIE-' . ($payrollRecord->employee_id ?? 'X') . '-' . $payrollDate->format('Y-m'),
                'description' => 'Fiche de paie ' . ($payrollRecord->id),
                'lines' => $lines,
            ];

            $this->logAccountingEntryAction->execute($entryData);

            return $payrollRecord;
        });
    }
}

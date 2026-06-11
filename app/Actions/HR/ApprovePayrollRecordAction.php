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

final readonly class ApprovePayrollRecordAction
{
    public function __construct(
        private LogAccountingEntryAction $logAccountingEntryAction
    ) {}

    public function execute(PayrollRecord $payrollRecord, int $userId): PayrollRecord
    {
        $payrollRecord->loadMissing('employee:id,analytical_code_id');

        return DB::transaction(function () use ($payrollRecord, $userId) {
            $payrollRecord->update([
                'status' => 'approved',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            $payrollDate = $payrollRecord->period_start ?? now();

            $financialYear = FinancialYear::select(['id'])
                ->where('is_closed', false)
                ->where('start_date', '<=', $payrollDate)
                ->where('end_date', '>=', $payrollDate)
                ->first() ?? throw ValidationException::withMessages([
                    'period' => 'Aucun exercice comptable actif trouvé pour la date de cette paie.',
                ]);

            // 1. Définir les comptes requis dynamiquement
            $requiredAccountCodes = [
                Account::CODE_SALARIES_EXPENSE, // ex: 6611
                Account::CODE_SALARIES_PAYABLE, // ex: 422
            ];

            if ($payrollRecord->deductions > 0) {
                $requiredAccountCodes[] = Account::CODE_SALARIES_ADVANCES; // ex: 421
            }

            // 2. Requête Batch
            $accounts = Account::select(['id', 'number'])
                ->whereIn('number', $requiredAccountCodes)
                ->get()
                ->keyBy('number');

            // 3. VÉRIFICATION STRICTE (Correction du bug)
            foreach ($requiredAccountCodes as $code) {
                if (!isset($accounts[$code])) {
                    throw ValidationException::withMessages([
                        'accounting' => "Configuration incomplète : Le compte comptable '{$code}' est introuvable. Veuillez le créer dans le module Comptabilité.",
                    ]);
                }
            }

            $journalId = AccountingJournal::where('code', AccountingJournal::CODE_PAYROLL)->value('id');
            
            if (!$journalId) {
                throw ValidationException::withMessages([
                    'accounting' => "Configuration incomplète : Le journal de paie est introuvable.",
                ]);
            }

            $lines = [
                [
                    'account_id' => $accounts[Account::CODE_SALARIES_EXPENSE]->id,
                    'debit' => $payrollRecord->base_salary_snapshot, // Utilisation du snapshot
                    'credit' => 0,
                    'analytical_center_id' => $this->resolveAnalyticalCenterId($payrollRecord),
                ],
                [
                    'account_id' => $accounts[Account::CODE_SALARIES_PAYABLE]->id,
                    'debit' => 0,
                    'credit' => $payrollRecord->net_salary,
                    'analytical_center_id' => null,
                ],
            ];

            if ($payrollRecord->deductions > 0) {
                $lines[] = [
                    'account_id' => $accounts[Account::CODE_SALARIES_ADVANCES]->id,
                    'debit' => 0,
                    'credit' => $payrollRecord->deductions,
                    'analytical_center_id' => null,
                ];
            }

            $this->logAccountingEntryAction->execute([
                'financial_year_id' => $financialYear->id,
                'accounting_journal_id' => $journalId,
                'date' => $payrollDate->format('Y-m-d'),
                'reference' => 'PAIE-' . ($payrollRecord->employee_id ?? 'X') . '-' . $payrollDate->format('Y-m'),
                'description' => 'Fiche de paie ' . $payrollRecord->id,
                'lines' => $lines,
            ]);

            return $payrollRecord;
        });
    }

    private function resolveAnalyticalCenterId(PayrollRecord $payrollRecord): ?int
    {
        $analyticalCodeId = $payrollRecord->employee?->analytical_code_id;
        
        if (! $analyticalCodeId) {
            return null;
        }

        // On évite d'hydrater tout le modèle Nature, on prend juste l'ID
        $natureId = AnalyticalNature::where('code', AnalyticalNature::CODE_PAYROLL)->value('id');

        return AnalyticalCenter::where('analytical_nature_id', $natureId)
            ->where('analytical_code_id', $analyticalCodeId)
            ->value('id');
    }
}
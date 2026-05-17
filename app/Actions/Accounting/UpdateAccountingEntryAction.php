<?php

namespace App\Actions\Accounting;

use App\Models\AccountingEntry;
use App\Models\FinancialYear;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdateAccountingEntryAction
{
    public function execute(AccountingEntry $accountingEntry, array $data): AccountingEntry
    {
        if ($accountingEntry->status !== AccountingEntry::STATUS_DRAFT) {
            throw ValidationException::withMessages([
                'status' => 'Impossible de modifier ou supprimer une écriture déjà validée.',
            ]);
        }

        $financialYear = FinancialYear::findOrFail($data['financial_year_id']);

        if ($financialYear->is_closed) {
            throw ValidationException::withMessages([
                'financial_year_id' => 'Impossible de saisir une écriture dans un exercice clôturé.',
            ]);
        }

        $totalDebit = 0;
        $totalCredit = 0;

        foreach ($data['lines'] as $line) {
            $totalDebit += (float) $line['debit'];
            $totalCredit += (float) $line['credit'];
        }

        $totalDebit = round($totalDebit, 2);
        $totalCredit = round($totalCredit, 2);

        if ($totalDebit !== $totalCredit) {
            throw ValidationException::withMessages([
                'lines' => 'L\'écriture comptable n\'est pas équilibrée (Total Débit != Total Crédit).',
            ]);
        }

        return DB::transaction(function () use ($accountingEntry, $data) {
            $headerData = collect($data)->except('lines')->toArray();
            $accountingEntry->update($headerData);

            // Cascade rules will delete lines, or we can force sync
            $accountingEntry->lines()->delete();
            $accountingEntry->lines()->createMany($data['lines']);

            return $accountingEntry;
        });
    }
}

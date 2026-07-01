<?php

namespace App\Actions\Accounting;

use App\Models\AccountingEntry;
use App\Models\FinancialYear;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final readonly class LogAccountingEntryAction
{
    public function execute(array $data): AccountingEntry
    {
        $financialYear = FinancialYear::findOrFail($data['financial_year_id']);

        if ($financialYear->is_closed) {
            throw ValidationException::withMessages([
                'financial_year_id' => 'Impossible de saisir une écriture dans un exercice clôturé.',
            ]);
        }

        $totalDebit = 0;
        $totalCredit = 0;

        foreach ($data['lines'] as $line) {
            $totalDebit += (int) $line['debit'];
            $totalCredit += (int) $line['credit'];
        }

        if ($totalDebit !== $totalCredit) {
            throw ValidationException::withMessages([
                'lines' => 'L\'écriture comptable n\'est pas équilibrée (Total Débit != Total Crédit).',
            ]);
        }

        return DB::transaction(function () use ($data, $financialYear) {
            $headerData = collect($data)->except(['lines', 'reference'])->toArray();
            $headerData['status'] = AccountingEntry::STATUS_DRAFT;

            // ⚡ APPEL ATOMIQUE POSTGRESQL (Zéro Lock)
            $sequence = DB::selectOne("SELECT nextval('accounting_entry_ref_seq') AS next_val");
            
            // Formatage de la référence finale (ex: PC-2026-00001)
            $headerData['reference'] = sprintf(
                'PC-%s-%05d', 
                $financialYear->year, 
                $sequence->next_val
            );

            $entry = AccountingEntry::create($headerData);
            $entry->lines()->createMany($data['lines']);

            return $entry;
        });
    }
}
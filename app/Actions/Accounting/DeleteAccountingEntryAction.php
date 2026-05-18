<?php

namespace App\Actions\Accounting;

use App\Models\AccountingEntry;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeleteAccountingEntryAction
{
    public function execute(AccountingEntry $accountingEntry): void
    {
        if ($accountingEntry->status !== AccountingEntry::STATUS_DRAFT) {
            throw ValidationException::withMessages([
                'status' => 'Impossible de modifier ou supprimer une écriture déjà validée.',
            ]);
        }

        DB::transaction(function () use ($accountingEntry) {
            $accountingEntry->delete(); // Lines will be cascade-deleted by DB SQL if hard deleted, or they stay if soft delete. The migration says cascadeOnDelete().
        });
    }
}

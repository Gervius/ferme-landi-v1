<?php

namespace App\Actions\Accounting;

use App\Models\AccountingEntry;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApproveAccountingEntryAction
{
    public function execute(AccountingEntry $accountingEntry): AccountingEntry
    {
        if ($accountingEntry->status !== AccountingEntry::STATUS_DRAFT) {
            throw ValidationException::withMessages([
                'status' => 'Cette écriture est déjà validée.',
            ]);
        }

        return DB::transaction(function () use ($accountingEntry) {
            $accountingEntry->update(['status' => AccountingEntry::STATUS_VALIDATED]);
            return $accountingEntry;
        });
    }
}

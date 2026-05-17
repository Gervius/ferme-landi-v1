<?php

namespace App\Actions\Accounting;

use App\Models\AccountingJournal;
use Illuminate\Support\Facades\DB;

class DeleteAccountingJournalAction
{
    public function execute(AccountingJournal $accountingJournal): void
    {
        DB::transaction(function () use ($accountingJournal) {
            $accountingJournal->delete();
        });
    }
}

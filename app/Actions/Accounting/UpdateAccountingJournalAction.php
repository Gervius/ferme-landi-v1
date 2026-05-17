<?php

namespace App\Actions\Accounting;

use App\Models\AccountingJournal;
use Illuminate\Support\Facades\DB;

class UpdateAccountingJournalAction
{
    public function execute(AccountingJournal $accountingJournal, array $data): AccountingJournal
    {
        return DB::transaction(function () use ($accountingJournal, $data) {
            $accountingJournal->update($data);
            return $accountingJournal;
        });
    }
}

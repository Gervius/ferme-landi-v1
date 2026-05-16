<?php

namespace App\Actions\Accounting;

use App\Models\AccountingJournal;
use Illuminate\Support\Facades\DB;

class CreateAccountingJournalAction
{
    public function execute(array $data): AccountingJournal
    {
        return DB::transaction(function () use ($data) {
            return AccountingJournal::create($data);
        });
    }
}

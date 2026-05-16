<?php

namespace App\Actions\Accounting;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

class DeleteAccountAction
{
    public function execute(Account $account): void
    {
        DB::transaction(function () use ($account) {
            $account->delete();
        });
    }
}

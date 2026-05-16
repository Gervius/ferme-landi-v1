<?php

namespace App\Actions\Accounting;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

class UpdateAccountAction
{
    public function execute(Account $account, array $data): Account
    {
        return DB::transaction(function () use ($account, $data) {
            $account->update($data);
            return $account;
        });
    }
}

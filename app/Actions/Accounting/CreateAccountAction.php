<?php

namespace App\Actions\Accounting;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

class CreateAccountAction
{
    public function execute(array $data): Account
    {
        return DB::transaction(function () use ($data) {
            return Account::create($data);
        });
    }
}

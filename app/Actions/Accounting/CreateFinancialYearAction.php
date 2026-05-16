<?php

namespace App\Actions\Accounting;

use App\Models\FinancialYear;
use Illuminate\Support\Facades\DB;

class CreateFinancialYearAction
{
    public function execute(array $data): FinancialYear
    {
        return DB::transaction(function () use ($data) {
            return FinancialYear::create($data);
        });
    }
}

<?php

namespace App\Actions\Accounting;

use App\Models\FinancialYear;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CloseFinancialYearAction
{
    public function execute(FinancialYear $financialYear): FinancialYear
    {
        if ($financialYear->is_closed) {
            throw ValidationException::withMessages([
                'is_closed' => 'L\'exercice est déjà clôturé.',
            ]);
        }

        return DB::transaction(function () use ($financialYear) {
            $financialYear->update(['is_closed' => true]);
            return $financialYear;
        });
    }
}

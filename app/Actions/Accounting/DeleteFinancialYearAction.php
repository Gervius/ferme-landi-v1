<?php

namespace App\Actions\Accounting;

use App\Models\FinancialYear;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeleteFinancialYearAction
{
    public function execute(FinancialYear $financialYear): void
    {
        if ($financialYear->is_closed) {
            throw ValidationException::withMessages([
                'is_closed' => 'Impossible de supprimer un exercice clôturé.',
            ]);
        }

        DB::transaction(function () use ($financialYear) {
            $financialYear->delete();
        });
    }
}

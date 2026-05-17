<?php

namespace App\Actions\Accounting;

use App\Models\FinancialYear;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdateFinancialYearAction
{
    public function execute(FinancialYear $financialYear, array $data): FinancialYear
    {
        if ($financialYear->is_closed) {
            throw ValidationException::withMessages([
                'is_closed' => 'Impossible de modifier un exercice clôturé.',
            ]);
        }

        return DB::transaction(function () use ($financialYear, $data) {
            $financialYear->update($data);
            return $financialYear;
        });
    }
}

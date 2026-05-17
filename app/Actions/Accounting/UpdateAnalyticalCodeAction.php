<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalCode;
use Illuminate\Support\Facades\DB;

class UpdateAnalyticalCodeAction
{
    public function execute(AnalyticalCode $analyticalCode, array $data): AnalyticalCode
    {
        return DB::transaction(function () use ($analyticalCode, $data) {
            $analyticalCode->update($data);
            return $analyticalCode;
        });
    }
}

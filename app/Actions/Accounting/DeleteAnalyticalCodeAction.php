<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalCode;
use Illuminate\Support\Facades\DB;

class DeleteAnalyticalCodeAction
{
    public function execute(AnalyticalCode $analyticalCode): void
    {
        DB::transaction(function () use ($analyticalCode) {
            // Delete associated centers first
            $analyticalCode->centers()->delete();

            $analyticalCode->delete();
        });
    }
}

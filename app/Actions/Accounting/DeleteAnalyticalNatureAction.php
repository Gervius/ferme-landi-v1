<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalNature;
use Illuminate\Support\Facades\DB;

class DeleteAnalyticalNatureAction
{
    public function execute(AnalyticalNature $analyticalNature): void
    {
        DB::transaction(function () use ($analyticalNature) {
            // Delete associated centers first
            $analyticalNature->centers()->delete();

            $analyticalNature->delete();
        });
    }
}

<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalCenter;
use Illuminate\Support\Facades\DB;

class DeleteAnalyticalCenterAction
{
    public function execute(AnalyticalCenter $analyticalCenter): void
    {
        DB::transaction(function () use ($analyticalCenter) {
            $analyticalCenter->delete();
        });
    }
}

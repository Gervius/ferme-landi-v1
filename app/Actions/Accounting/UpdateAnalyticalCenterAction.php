<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalCenter;
use Illuminate\Support\Facades\DB;

class UpdateAnalyticalCenterAction
{
    public function execute(AnalyticalCenter $analyticalCenter, array $data): AnalyticalCenter
    {
        return DB::transaction(function () use ($analyticalCenter, $data) {
            $analyticalCenter->update($data);
            return $analyticalCenter;
        });
    }
}

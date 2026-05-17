<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalCenter;
use Illuminate\Support\Facades\DB;

class CreateAnalyticalCenterAction
{
    public function execute(array $data): AnalyticalCenter
    {
        return DB::transaction(function () use ($data) {
            return AnalyticalCenter::create($data);
        });
    }
}

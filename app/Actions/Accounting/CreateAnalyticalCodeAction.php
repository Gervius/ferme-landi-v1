<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalCode;
use Illuminate\Support\Facades\DB;

class CreateAnalyticalCodeAction
{
    public function execute(array $data): AnalyticalCode
    {
        return DB::transaction(function () use ($data) {
            return AnalyticalCode::create($data);
        });
    }
}

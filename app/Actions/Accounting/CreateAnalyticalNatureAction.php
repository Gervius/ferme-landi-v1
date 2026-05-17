<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalNature;
use Illuminate\Support\Facades\DB;

class CreateAnalyticalNatureAction
{
    public function execute(array $data): AnalyticalNature
    {
        return DB::transaction(function () use ($data) {
            return AnalyticalNature::create($data);
        });
    }
}

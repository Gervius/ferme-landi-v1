<?php

namespace App\Actions\Accounting;

use App\Models\AnalyticalNature;
use Illuminate\Support\Facades\DB;

class UpdateAnalyticalNatureAction
{
    public function execute(AnalyticalNature $analyticalNature, array $data): AnalyticalNature
    {
        return DB::transaction(function () use ($analyticalNature, $data) {
            $analyticalNature->update($data);
            return $analyticalNature;
        });
    }
}

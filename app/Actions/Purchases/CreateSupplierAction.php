<?php

namespace App\Actions\Purchases;

use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class CreateSupplierAction
{
    public function execute(array $data): Supplier
    {
        return DB::transaction(function () use ($data) {
            return Supplier::create($data);
        });
    }
}

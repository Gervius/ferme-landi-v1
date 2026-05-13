<?php

namespace App\Actions\Purchases;

use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class UpdateSupplierAction
{
    public function execute(Supplier $supplier, array $data): Supplier
    {
        return DB::transaction(function () use ($supplier, $data) {
            $supplier->update($data);
            return $supplier;
        });
    }
}

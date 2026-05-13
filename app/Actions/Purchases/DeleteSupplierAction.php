<?php

namespace App\Actions\Purchases;

use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class DeleteSupplierAction
{
    public function execute(Supplier $supplier): void
    {
        DB::transaction(function () use ($supplier) {
            $supplier->delete();
        });
    }
}

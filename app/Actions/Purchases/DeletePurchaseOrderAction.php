<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class DeletePurchaseOrderAction
{
    public function execute(PurchaseOrder $order): void
    {
        DB::transaction(function () use ($order) {
            $order->items()->delete();
            $order->delete();
        });
    }
}

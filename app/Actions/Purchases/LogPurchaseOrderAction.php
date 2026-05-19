<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class LogPurchaseOrderAction
{
    public function execute(array $data, int $userId): PurchaseOrder
    {
        return DB::transaction(function () use ($data, $userId) {
            $order = PurchaseOrder::create([
                'site_id' => $data['site_id'],
                'supplier_id' => $data['supplier_id'],
                'order_date' => $data['order_date'],
                'reference' => $data['reference'],
                'created_by' => $userId,
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create($item);
            }

            return $order;
        });
    }
}

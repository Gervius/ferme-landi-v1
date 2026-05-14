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
                'supplier_id' => $data['supplier_id'],
                'order_date'  => $data['order_date'],
                'reference'   => $data['reference'],
                'status'      => 'draft',
                'created_by'  => $userId,
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create([
                    'category_id' => $item['category_id'],
                    'unit_id'     => $item['unit_id'],
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $item['unit_price'],
                ]);
            }

            return $order;
        });
    }
}

<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;

class UpdatePurchaseOrderAction
{
    public function execute(PurchaseOrder $order, array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($order, $data) {
            $order->update([
                'supplier_id' => $data['supplier_id'],
                'order_date'  => $data['order_date'],
                'reference'   => $data['reference'],
                'status'      => $data['status'] ?? $order->status,
            ]);

            if (isset($data['items'])) {
                $order->items()->delete();
                foreach ($data['items'] as $item) {
                    $order->items()->create([
                        'category_id' => $item['category_id'],
                        'unit_id'     => $item['unit_id'],
                        'quantity'    => $item['quantity'],
                        'unit_price'  => $item['unit_price'],
                    ]);
                }
            }

            return $order;
        });
    }
}

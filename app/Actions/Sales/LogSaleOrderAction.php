<?php

namespace App\Actions\Sales;

use App\Models\SaleOrder;
use Illuminate\Support\Facades\DB;

class LogSaleOrderAction
{
    public function execute(array $data, int $userId): SaleOrder
    {
        return DB::transaction(function () use ($data, $userId) {
            // Génération atomique de la référence via PostgreSQL
            $seq = DB::scalar("SELECT nextval('sale_order_ref_seq')");
            $reference = 'CMD-' . str_pad($seq, 5, '0', STR_PAD_LEFT);

            $order = SaleOrder::create([
                'site_id' => $data['site_id'],
                'customer_id' => $data['customer_id'],
                'order_date' => $data['order_date'],
                'reference' => $reference,
                'status' => 'draft',
                'created_by' => $userId,
            ]);

            // Insertion en masse (Zero N+1)
            $order->items()->createMany($data['items']);

            return $order;
        });
    }
}
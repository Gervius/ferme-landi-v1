<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseReceipt;
use Illuminate\Support\Facades\DB;

class LogPurchaseReceiptAction
{
    public function execute(array $data, int $userId): PurchaseReceipt
    {
        return DB::transaction(function () use ($data, $userId) {
            $receipt = PurchaseReceipt::create([
                'purchase_order_id' => $data['purchase_order_id'] ?? null,
                'receipt_date'      => $data['receipt_date'],
                'reference'         => $data['reference'],
                'status'            => 'draft',
                'prepared_by'       => $userId,
            ]);

            foreach ($data['items'] as $item) {
                $receipt->items()->create([
                    'purchase_order_item_id' => $item['purchase_order_item_id'] ?? null,
                    'category_id'            => $item['category_id'],
                    'unit_id'                => $item['unit_id'],
                    'received_quantity'      => $item['received_quantity'],
                ]);
            }

            return $receipt;
        });
    }
}

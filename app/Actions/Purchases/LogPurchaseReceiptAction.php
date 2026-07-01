<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseReceipt;
use Illuminate\Support\Facades\DB;

class LogPurchaseReceiptAction
{
    public function execute(array $data, int $userId): PurchaseReceipt
    {
        return DB::transaction(function () use ($data, $userId) {

            $sequence = DB::selectOne("SELECT nextval('purchase_receipt_ref_seq') AS next_val")->next_val;
            $reference = sprintf('BR-%s-%04d', date('ym'), $sequence);

            $receipt = PurchaseReceipt::create([
                'site_id'           => $data['site_id'], // 🔴 LA CORRECTION EST ICI
                'purchase_order_id' => $data['purchase_order_id'] ?? null,
                'receipt_date'      => $data['receipt_date'],
                'reference'         => $reference,
                'status'            => 'draft',
                'prepared_by'       => $userId,
            ]);

            foreach ($data['items'] as $item) {
                $receipt->items()->create([
                    'purchase_order_item_id' => $item['purchase_order_item_id'] ?? null,
                    'item_id'                => $item['item_id'],
                    'unit_id'                => $item['unit_id'],
                    'received_quantity'      => $item['received_quantity'],
                ]);
            }

            return $receipt;
        });
    }
}
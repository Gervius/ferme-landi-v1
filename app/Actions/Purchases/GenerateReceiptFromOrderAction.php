<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseOrder;
use App\Models\PurchaseReceipt;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GenerateReceiptFromOrderAction
{
    public function execute(PurchaseOrder $order, int $userId): PurchaseReceipt
    {
        if ($order->status !== 'approved' && $order->status !== 'validated') {
            // Adjust to your exact approved status if it's 'approved' or 'validated'. Usually HasApprovalWorkflow uses 'approved' or 'validated'.
            // Let's check `HasApprovalWorkflow` or just assume it's 'approved'.
            if (! in_array($order->status, ['approved', 'validated'])) {
                throw ValidationException::withMessages([
                    'status' => 'La commande doit être approuvée pour générer un bon de réception.',
                ]);
            }
        }

        $existingReceipt = PurchaseReceipt::where('purchase_order_id', $order->id)->exists();
        if ($existingReceipt) {
            throw ValidationException::withMessages([
                'purchase_order_id' => 'Un bon de réception existe déjà pour cette commande.',
            ]);
        }

        return DB::transaction(function () use ($order, $userId) {
            $receipt = PurchaseReceipt::create([
                'site_id' => $order->site_id,
                'purchase_order_id' => $order->id,
                'receipt_date' => now()->format('Y-m-d'),
                'reference' => 'REC-' . $order->reference,
                'status' => 'draft',
                'prepared_by' => $userId,
            ]);

            $itemsData = $order->items->map(function ($item) {
                return [
                    'purchase_order_item_id' => $item->id,
                    'category_id' => $item->category_id,
                    'unit_id' => $item->unit_id,
                    'received_quantity' => $item->quantity,
                ];
            });

            $receipt->items()->createMany($itemsData->toArray());

            return $receipt;
        });
    }
}

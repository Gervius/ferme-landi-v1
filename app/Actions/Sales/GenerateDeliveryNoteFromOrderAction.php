<?php

namespace App\Actions\Sales;

use App\Models\DeliveryNote;
use App\Models\SaleOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GenerateDeliveryNoteFromOrderAction
{
    public function execute(SaleOrder $order, int $userId): DeliveryNote
    {
        if (! in_array($order->status, ['approved', 'validated'])) {
            throw ValidationException::withMessages([
                'status' => 'La commande doit être approuvée pour générer un bon de livraison.',
            ]);
        }

        $existingNote = DeliveryNote::where('sale_order_id', $order->id)->exists();
        if ($existingNote) {
            throw ValidationException::withMessages([
                'sale_order_id' => 'Un bon de livraison existe déjà pour cette commande.',
            ]);
        }

        return DB::transaction(function () use ($order, $userId) {
            $deliveryNote = DeliveryNote::create([
                'site_id' => $order->site_id,
                'sale_order_id' => $order->id,
                'delivery_date' => now()->format('Y-m-d'),
                'reference' => 'BL-' . $order->reference,
                'status' => 'draft',
                'prepared_by' => $userId,
            ]);

            $itemsData = $order->items->map(function ($item) {
                return [
                    'sale_order_item_id' => $item->id,
                    'category_id' => $item->category_id,
                    'unit_id' => $item->unit_id,
                    'delivered_quantity' => $item->quantity,
                ];
            });

            $deliveryNote->items()->createMany($itemsData->toArray());

            return $deliveryNote;
        });
    }
}

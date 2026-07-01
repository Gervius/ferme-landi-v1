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

        if (DeliveryNote::where('sale_order_id', $order->id)->exists()) {
            throw ValidationException::withMessages([
                'sale_order_id' => 'Un bon de livraison existe déjà pour cette commande.',
            ]);
        }

        return DB::transaction(function () use ($order, $userId) {
            // Eager loading strict de la commande
            $order->load('items');

            $seq = DB::scalar("SELECT nextval('delivery_note_ref_seq')");
            
            $deliveryNote = DeliveryNote::create([
                'site_id' => $order->site_id,
                'sale_order_id' => $order->id,
                'delivery_date' => now()->format('Y-m-d'),
                'reference' => 'BL-' . str_pad($seq, 5, '0', STR_PAD_LEFT),
                'status' => 'draft',
                'prepared_by' => $userId,
            ]);

            $itemsData = $order->items->map(fn ($item) => [
                'sale_order_item_id' => $item->id,
                'item_id' => $item->item_id, // Ciblage physique strict
                'delivered_quantity' => $item->quantity,
            ])->toArray();

            $deliveryNote->items()->createMany($itemsData);

            return $deliveryNote;
        });
    }
}
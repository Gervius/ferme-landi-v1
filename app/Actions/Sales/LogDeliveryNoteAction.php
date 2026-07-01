<?php

namespace App\Actions\Sales;

use App\Models\DeliveryNote;
use Illuminate\Support\Facades\DB;

class LogDeliveryNoteAction
{
    public function execute(array $data, int $userId): DeliveryNote
    {
        return DB::transaction(function () use ($data, $userId) {
            $seq = DB::scalar("SELECT nextval('delivery_note_ref_seq')");

            $deliveryNote = DeliveryNote::create([
                'site_id' => $data['site_id'],
                'sale_order_id' => $data['sale_order_id'] ?? null,
                'delivery_date' => $data['delivery_date'],
                'reference' => 'BL-' . str_pad($seq, 5, '0', STR_PAD_LEFT),
                'status' => 'draft',
                'prepared_by' => $userId,
            ]);

            if (isset($data['items']) && is_array($data['items'])) {
                $itemsData = array_map(fn($item) => [
                    'sale_order_item_id' => $item['sale_order_item_id'] ?? null,
                    'item_id' => $item['item_id'], // Ciblage physique strict
                    'delivered_quantity' => $item['delivered_quantity'],
                ], $data['items']);

                $deliveryNote->items()->createMany($itemsData); // Batch insert (Zero N+1)
            }

            return $deliveryNote;
        });
    }
}
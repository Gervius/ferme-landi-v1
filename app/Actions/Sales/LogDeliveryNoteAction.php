<?php

namespace App\Actions\Sales;

use App\Models\DeliveryNote;
use Illuminate\Support\Facades\DB;

class LogDeliveryNoteAction
{
    /**
     * Log a new delivery note record in draft status.
     *
     * @param array $data Expected keys: 'sale_order_id' (optional), 'delivery_date', 'reference', 'items' (array of items)
     * @param int $userId
     * @return DeliveryNote
     */
    public function execute(array $data, int $userId): DeliveryNote
    {
        return DB::transaction(function () use ($data, $userId) {
            $deliveryNote = DeliveryNote::create([
                'sale_order_id' => $data['sale_order_id'] ?? null,
                'delivery_date' => $data['delivery_date'],
                'reference' => $data['reference'],
                'status' => 'draft',
                'prepared_by' => $userId,
            ]);

            if (isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    $deliveryNote->items()->create([
                        'sale_order_item_id' => $item['sale_order_item_id'] ?? null,
                        'category_id' => $item['category_id'],
                        'unit_id' => $item['unit_id'],
                        'delivered_quantity' => $item['delivered_quantity'],
                    ]);
                }
            }

            return $deliveryNote;
        });
    }
}

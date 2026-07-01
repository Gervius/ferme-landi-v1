<?php

namespace App\Actions\Sales;

use App\Models\DeliveryNote;
use App\Actions\Stocks\LogStockMovementAction;
use Illuminate\Support\Facades\DB;

class ApproveDeliveryNoteAction
{
    public function __construct(
        private readonly LogStockMovementAction $logStockMovementAction
    ) {}

    public function execute(DeliveryNote $deliveryNote, int $approverId): DeliveryNote
    {
        if (! $deliveryNote->isDraft()) {
            throw new \InvalidArgumentException("Only draft delivery notes can be approved.");
        }

        return DB::transaction(function () use ($deliveryNote, $approverId) {
            $deliveryNote->approve($approverId);
            
            // Eager Loading strict pour éviter les fuites de RAM
            $deliveryNote->load('items');

            foreach ($deliveryNote->items as $item) {
                $this->logStockMovementAction->execute([
                    'site_id' => $deliveryNote->site_id,
                    'item_id' => $item->item_id, // Ciblage de l'entité physique
                    'type' => 'out',
                    'quantity' => $item->delivered_quantity,
                    'date' => $deliveryNote->delivery_date->format('Y-m-d'),
                    'reference_type' => DeliveryNote::class,
                    'reference_id' => $deliveryNote->id,
                ], $approverId);
            }

            return $deliveryNote;
        });
    }
}
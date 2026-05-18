<?php

namespace App\Actions\Sales;

use App\Models\DeliveryNote;
use App\Actions\Stocks\LogStockMovementAction;
use App\Services\Logistics\UnitConversionService;
use Illuminate\Support\Facades\DB;

class ApproveDeliveryNoteAction
{
    public function __construct(
        private readonly UnitConversionService $unitConversionService,
        private readonly LogStockMovementAction $logStockMovementAction
    ) {
    }

    /**
     * Approve a delivery note and deduct items from stock.
     *
     * @param DeliveryNote $deliveryNote
     * @param int $approverId
     * @return DeliveryNote
     */
    public function execute(DeliveryNote $deliveryNote, int $approverId): DeliveryNote
    {
        if (! $deliveryNote->isDraft()) {
            throw new \InvalidArgumentException("Only draft delivery notes can be approved.");
        }

        return DB::transaction(function () use ($deliveryNote, $approverId) {
            $deliveryNote->approve($approverId);

            foreach ($deliveryNote->items as $item) {
                $this->logStockMovementAction->execute([
                    'site_id' => $deliveryNote->site_id,
                    'category_id' => $item->category_id,
                    'unit_id' => $item->unit_id,
                    'type' => 'out',
                    'quantity' => $item->delivered_quantity,
                    'date' => $deliveryNote->delivery_date->format('Y-m-d'),
                    'reference_type' => get_class($deliveryNote),
                    'reference_id' => $deliveryNote->id,
                ], $approverId);
            }

            // Optionally, if linked to a SaleOrder, check quantities and update SaleOrder status to 'delivered' or 'partially_delivered'.
            // For now, this requires more complex logic, so we keep it simple as per requirements.

            return $deliveryNote;
        });
    }
}

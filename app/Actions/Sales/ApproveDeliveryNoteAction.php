<?php

namespace App\Actions\Sales;

use App\Models\DeliveryNote;
use App\Services\Inventory\StockService;
use App\Services\Logistics\UnitConversionService;
use Illuminate\Support\Facades\DB;

class ApproveDeliveryNoteAction
{
    public function __construct(
        private readonly UnitConversionService $unitConversionService,
        private readonly StockService $stockService
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
                $baseQuantity = $this->unitConversionService->toBase($item->delivered_quantity, $item->unit);

                $this->stockService->recordMovement(
                    $item->category_id,
                    'out',
                    $baseQuantity,
                    $deliveryNote,
                    $deliveryNote->delivery_date->format('Y-m-d'),
                    $approverId
                );
            }

            // Optionally, if linked to a SaleOrder, check quantities and update SaleOrder status to 'delivered' or 'partially_delivered'.
            // For now, this requires more complex logic, so we keep it simple as per requirements.

            return $deliveryNote;
        });
    }
}

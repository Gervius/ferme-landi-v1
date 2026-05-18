<?php

namespace App\Actions\Zootechnie;

use App\Models\FeedConsumption;
use App\Actions\Stocks\LogStockMovementAction;
use App\Services\Logistics\UnitConversionService;

class ApproveFeedConsumptionAction
{
    public function __construct(
        private readonly UnitConversionService $unitConversionService,
        private readonly LogStockMovementAction $logStockMovementAction
    ) {
    }

    /**
     * Approve a feed consumption record and calculate the total base quantity.
     *
     * @param FeedConsumption $consumption
     * @param int $approverId
     * @return FeedConsumption
     */
    public function execute(FeedConsumption $consumption, int $approverId): FeedConsumption
    {
        if (! $consumption->isDraft()) {
            throw new \InvalidArgumentException("Only draft feed consumption records can be approved.");
        }

        return \Illuminate\Support\Facades\DB::transaction(function () use ($consumption, $approverId) {
            // Calculate total base quantity
            $totalBaseQuantity = $this->unitConversionService->toBase($consumption->quantity, $consumption->unit);

            // Update total base quantity
            $consumption->total_base_quantity = $totalBaseQuantity;
            $consumption->save();

            // Approve the record
            $consumption->approve($approverId);

            // Mouvement de stock SORTANT sur la catégorie de l'aliment.
            $this->logStockMovementAction->execute([
                'site_id' => $consumption->generation->site_id,
                'category_id' => $consumption->item_category_id,
                'unit_id' => $consumption->unit_id,
                'type' => 'out',
                'quantity' => $consumption->quantity,
                'date' => $consumption->date->format('Y-m-d'),
                'reference_type' => get_class($consumption),
                'reference_id' => $consumption->id,
            ], $approverId);

            return $consumption;
        });
    }
}

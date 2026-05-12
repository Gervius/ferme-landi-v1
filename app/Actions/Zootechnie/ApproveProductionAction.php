<?php

namespace App\Actions\Zootechnie;

use App\Models\DailyProduction;
use App\Services\Inventory\StockService;
use App\Services\Logistics\UnitConversionService;

class ApproveProductionAction
{
    public function __construct(
        private readonly UnitConversionService $unitConversionService,
        private readonly StockService $stockService
    ) {
    }

    /**
     * Approve a daily production record and calculate the total base quantity.
     *
     * @param DailyProduction $production
     * @param int $approverId
     * @return DailyProduction
     */
    public function execute(DailyProduction $production, int $approverId): DailyProduction
    {
        if (! $production->isDraft()) {
            throw new \InvalidArgumentException("Only draft production records can be approved.");
        }

        return \Illuminate\Support\Facades\DB::transaction(function () use ($production, $approverId) {
            // Calculate total base quantity
            $totalQuantity = $production->good_quantity + $production->broken_quantity;
            $totalBaseQuantity = $this->unitConversionService->toBase($totalQuantity, $production->unit);

            // Update total base quantity
            $production->total_base_quantity = $totalBaseQuantity;
            $production->save();

            // Approve the record
            $production->approve($approverId);

            // Mouvement de stock ENTRANT pour les œufs
            if ($production->item_category_id) {
                $goodBaseQuantity = $this->unitConversionService->toBase($production->good_quantity, $production->unit);
                $this->stockService->recordMovement(
                    $production->item_category_id,
                    'in',
                    $goodBaseQuantity,
                    $production,
                    $production->date->format('Y-m-d'),
                    $approverId
                );
            }

            return $production;
        });
    }
}

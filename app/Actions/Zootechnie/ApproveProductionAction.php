<?php

namespace App\Actions\Zootechnie;

use App\Models\DailyProduction;
use App\Services\Logistics\UnitConversionService;

class ApproveProductionAction
{
    public function __construct(private readonly UnitConversionService $unitConversionService)
    {
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

            // TODO: Mouvement de stock ENTRANT pour les bons œufs dans l'inventaire des produits finis.

            return $production;
        });
    }
}

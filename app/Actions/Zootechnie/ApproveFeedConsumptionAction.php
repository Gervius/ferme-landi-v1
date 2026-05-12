<?php

namespace App\Actions\Zootechnie;

use App\Models\FeedConsumption;
use App\Services\Logistics\UnitConversionService;

class ApproveFeedConsumptionAction
{
    public function __construct(private readonly UnitConversionService $unitConversionService)
    {
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

        // Calculate total base quantity
        $totalBaseQuantity = $this->unitConversionService->toBase($consumption->quantity, $consumption->unit);

        // Update total base quantity
        $consumption->total_base_quantity = $totalBaseQuantity;
        $consumption->save();

        // Approve the record
        $consumption->approve($approverId);

        // TODO: Convertir la quantité en unité de base et faire un mouvement de stock SORTANT sur la catégorie de l'aliment.

        return $consumption;
    }
}

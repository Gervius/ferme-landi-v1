<?php

namespace App\Actions\Zootechnie;

use App\Models\DailyProduction;
use App\Actions\Stocks\LogStockMovementAction;
use App\Services\Logistics\UnitConversionService;

class ApproveProductionAction
{
    public function __construct(
        private readonly UnitConversionService $unitConversionService,
        private readonly LogStockMovementAction $logStockMovementAction // INJECTION DU NOUVEAU SYSTÈME
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
            // Chargement de la relation pour accéder au site_id
            $production->loadMissing('generation');

            // Calculate total base quantity
            $totalQuantity = $production->good_quantity + $production->broken_quantity;
            $totalBaseQuantity = $this->unitConversionService->toBase($totalQuantity, $production->unit);

            // Update total base quantity
            $production->total_base_quantity = $totalBaseQuantity;
            $production->save();

            // Approve the record
            $production->approve($approverId);

            // NOUVEAU SYSTÈME : Mouvement de stock ENTRANT pour les œufs
            if ($production->item_category_id) {
                $this->logStockMovementAction->execute([
                    'site_id' => $production->generation->site_id,
                    'category_id' => $production->item_category_id,
                    'unit_id' => $production->unit_id,
                    'type' => 'in',
                    'quantity' => $production->good_quantity, // On met en stock uniquement les bons œufs
                    'reference_type' => $production->getMorphClass(),
                    'reference_id' => $production->id,
                    'date' => $production->date->format('Y-m-d'),
                ], $approverId);
            }

            return $production;
        });
    }
}
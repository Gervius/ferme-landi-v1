<?php

namespace App\Actions\Zootechnie;

use App\Models\DailyProduction;
use App\Actions\Stocks\LogStockMovementAction;
use App\Services\Logistics\UnitConversionService;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final readonly class ApproveProductionAction
{
    public function __construct(
        private UnitConversionService $unitConversionService,
        private LogStockMovementAction $logStockMovementAction
    ) {}

    public function execute(int $productionId, int $approverId): DailyProduction
    {
        return DB::transaction(function () use ($productionId, $approverId) {
            // VERROU DE CONCURRENCE
            $production = DailyProduction::where('id', $productionId)->lockForUpdate()->firstOrFail();

            if ($production->status !== 'draft') {
                throw new InvalidArgumentException("Cette production a déjà été traitée.");
            }

            // 🔴 OPTIMISATION RAM & N+1 : On charge le site_id ET les données de l'unité
            $production->loadMissing([
                'generation:id,site_id',
                'unit:id,conversion_rate,base_unit_id'
            ]);

            $totalQuantity = $production->good_quantity + $production->broken_quantity;
            $totalBaseQuantity = $this->unitConversionService->toBase($totalQuantity, $production->unit);

            $production->update([
                'total_base_quantity' => $totalBaseQuantity,
                'status' => 'approved',
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            if ($production->item_id) { // Remplacé
                $this->logStockMovementAction->execute([
                    'site_id' => $production->generation->site_id,
                    'item_id' => $production->item_id, // Remplacé
                    'unit_id' => $production->unit_id,
                    'type' => 'in',
                    'quantity' => $production->good_quantity,
                    'reference_type' => $production->getMorphClass(),
                    'reference_id' => $production->id,
                    'date' => $production->date->format('Y-m-d'),
                ], $approverId);
            }

            return $production;
        });
    }
}
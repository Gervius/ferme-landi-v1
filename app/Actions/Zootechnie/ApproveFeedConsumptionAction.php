<?php

namespace App\Actions\Zootechnie;

use App\Models\FeedConsumption;
use App\Actions\Stocks\LogStockMovementAction;
use App\Services\Logistics\UnitConversionService;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final readonly class ApproveFeedConsumptionAction
{
    public function __construct(
        private UnitConversionService $unitConversionService,
        private LogStockMovementAction $logStockMovementAction
    ) {}

    public function execute(FeedConsumption $consumption, int $approverId): FeedConsumption
    {
        if (! $consumption->isDraft()) {
            throw new InvalidArgumentException("Only draft feed consumption records can be approved.");
        }

        return DB::transaction(function () use ($consumption, $approverId) {
            
            $consumption->loadMissing([
                'unit:id,conversion_rate,base_unit_id', 
                'generation:id,site_id'
            ]);

            // Calculate total base quantity
            $totalBaseQuantity = $this->unitConversionService->toBase($consumption->quantity, $consumption->unit);

            // Update only specific fields to save RAM/Queries (avoid global save())
            $consumption->update([
                'total_base_quantity' => $totalBaseQuantity,
                'status' => 'approved',
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            // Mouvement de stock SORTANT
            $this->logStockMovementAction->execute([
                'site_id' => $consumption->generation->site_id,
                'item_id' => $consumption->item_id, // Remplacé (item au lieu de category)
                'unit_id' => $consumption->unit_id,
                'type' => 'out',
                'quantity' => $consumption->quantity,
                'date' => $consumption->date->format('Y-m-d'),
                'reference_type' => $consumption->getMorphClass(),
                'reference_id' => $consumption->id,
            ], $approverId);

            return $consumption;
        });
    }
}
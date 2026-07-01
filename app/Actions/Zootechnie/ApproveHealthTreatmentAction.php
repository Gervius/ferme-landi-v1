<?php

namespace App\Actions\Zootechnie;

use App\Models\HealthTreatment;
use App\Actions\Stocks\LogStockMovementAction;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final readonly class ApproveHealthTreatmentAction
{
    public function __construct(
        private LogStockMovementAction $logStockMovementAction
    ) {}

    public function execute(HealthTreatment $treatment, int $approverId): HealthTreatment
    {
        if (! $treatment->isDraft()) {
            throw new InvalidArgumentException("Only draft health treatments can be approved.");
        }

        return DB::transaction(function () use ($treatment, $approverId) {
            $treatment->loadMissing('generation:id,site_id');
            
            $treatment->update([
                'status' => 'approved',
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            // Si un médicament physique a été consommé, on le déduit du stock
            if ($treatment->item_id && $treatment->quantity && $treatment->unit_id) {
                $this->logStockMovementAction->execute([
                    'site_id' => $treatment->generation->site_id,
                    'item_id' => $treatment->item_id,
                    'unit_id' => $treatment->unit_id,
                    'type' => 'out',
                    'quantity' => $treatment->quantity,
                    'date' => $treatment->date->format('Y-m-d'),
                    'reference_type' => $treatment->getMorphClass(),
                    'reference_id' => $treatment->id,
                ], $approverId);
            }

            return $treatment;
        });
    }
}
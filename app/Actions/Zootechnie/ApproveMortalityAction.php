<?php

namespace App\Actions\Zootechnie;

use App\Enums\GenerationStatus;
use App\Models\FlockMortality;
use App\Models\Generation;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final readonly class ApproveMortalityAction
{
    public function execute(FlockMortality $mortality, int $approverId): FlockMortality
    {
        return DB::transaction(function () use ($mortality, $approverId) {
            $mortality = FlockMortality::where('id', $mortality->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (! $mortality->isDraft()) {
                throw new InvalidArgumentException("Cette mortalité a déjà été validée.");
            }

            // OPTIMISATION RAM : On ne select que les 3 colonnes vitales pour le calcul
            $generation = Generation::select('id', 'current_quantity', 'status')
                ->where('id', $mortality->generation_id)
                ->lockForUpdate()
                ->firstOrFail();

            $mortality->update([
                'status' => 'approved', // Ou utiliser un Enum WorkflowStatus
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            $newQuantity = $generation->current_quantity - $mortality->quantity;
            
            // CORRECTION : Utilisation stricte de l'Enum
            $generation->update([
                'current_quantity' => max(0, $newQuantity),
                'status'           => $newQuantity <= 0 ? GenerationStatus::CLOTURE->value : $generation->status,
            ]);

            return $mortality;
        });
    }
}
<?php

namespace App\Actions\Zootechnie;

use App\Enums\GenerationStatus;
use App\Models\Generation;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

final readonly class UpdateGenerationAction
{
    /**
     * Update a generation (batch/lot) with concurrency protection.
     *
     * @param Generation $generation The generation instance (will be reloaded with lock)
     * @param array $data Update data (immutable fields are filtered out)
     * @return Generation The updated generation instance
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function execute(Generation $generation, array $data): Generation
    {
        return DB::transaction(function () use ($generation, $data) {
            // 🔒 VERROU PESSIMISTE : bloque toute modification concurrente sur cette génération
            $lockedGeneration = Generation::where('id', $generation->id)
                ->lockForUpdate()
                ->firstOrFail();

            // 1. VERROUILLAGE : On ignore silencieusement toute tentative de modifier l'ADN du lot.
            $safeData = Arr::except($data, ['type', 'site_id', 'breed_id', 'start_date']);

            // 2. MISE À JOUR (sur l'instance verrouillée)
            $lockedGeneration->update($safeData);

            // 3. NETTOYAGE : Si le lot est clôturé, on annule les traitements prophylactiques futurs.
            if (
                isset($safeData['status']) && 
                $safeData['status'] === GenerationStatus::CLOTURE->value && 
                $lockedGeneration->wasChanged('status')
            ) {
                DB::table('scheduled_treatments')
                    ->where('generation_id', $lockedGeneration->id)
                    ->where('status', 'pending')
                    ->update(['status' => 'cancelled']);
            }

            return $lockedGeneration;
        });
    }
}
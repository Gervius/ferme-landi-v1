<?php

namespace App\Actions\Zootechnie;

use App\Models\Generation;
use Illuminate\Support\Facades\DB;

final readonly class UpdateFlockStatusAction
{
    /**
     * Update flock quantity and status with concurrency protection.
     *
     * @param Generation $generation The generation instance (will be reloaded with lock)
     * @param int $quantityChange Positive or negative quantity change
     * @param bool $closeFlock Force closure regardless of quantity
     * @return Generation The updated generation instance
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function execute(Generation $generation, int $quantityChange, bool $closeFlock = false): Generation
    {
        return DB::transaction(function () use ($generation, $quantityChange, $closeFlock) {
            // 🔒 VERROU PESSIMISTE : bloque toute lecture/écriture concurrente sur cette génération
            $lockedGeneration = Generation::where('id', $generation->id)
                ->lockForUpdate()
                ->firstOrFail();

            $newQuantity = $lockedGeneration->current_quantity + $quantityChange;

            $lockedGeneration->update([
                'current_quantity' => max(0, $newQuantity),
                'status'           => $closeFlock || $newQuantity <= 0 ? 'cloture' : 'actif',
            ]);

            return $lockedGeneration;
        });
    }
}
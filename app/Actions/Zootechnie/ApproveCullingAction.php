<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockCulling;
use App\Models\Generation;
use Illuminate\Support\Facades\DB;

final readonly class ApproveCullingAction
{
    /**
     * Approves culling record and impacts the flock quantity.
     * Race condition safe : lockForUpdate on both culling and generation.
     */
    public function execute(FlockCulling $culling, int $approverId): FlockCulling
    {
        return DB::transaction(function () use ($culling, $approverId) {
            // 1. Verrouillage de l'enregistrement de réforme
            $culling = FlockCulling::where('id', $culling->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Vérification que le brouillon n'a pas déjà été approuvé par une autre transaction
            if (! $culling->isDraft()) {
                throw new \InvalidArgumentException("Cette réforme a déjà été validée.");
            }

            // 2. Verrouillage de la génération associée (empêche toute autre modification concurrente)
            $generation = Generation::where('id', $culling->generation_id)
                ->lockForUpdate()
                ->firstOrFail();

            // 3. Approbation de la réforme
            $culling->approve($approverId);

            // 4. Mise à jour du cheptel (calcul direct sans appel externe pour rester dans la même transaction)
            $newQuantity = $generation->current_quantity - $culling->quantity_culled;
            $generation->update([
                'current_quantity' => max(0, $newQuantity),
                'status'           => $newQuantity <= 0 ? 'cloture' : $generation->status,
            ]);

            // TODO: Inject this quantity into finished goods inventory (Category: "Poules Réformées") for sale.

            return $culling;
        });
    }
}
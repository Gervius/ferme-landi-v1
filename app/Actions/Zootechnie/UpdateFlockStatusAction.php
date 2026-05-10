<?php

namespace App\Actions\Zootechnie;

use App\Models\Generation;

class UpdateFlockStatusAction
{
    /**
     * Updates the current quantity and optionally closes the flock.
     */
    public function execute(Generation $generation, int $quantityChange, bool $closeFlock = false): Generation
    {
        $newQuantity = $generation->current_quantity + $quantityChange;

        $generation->update([
            'current_quantity' => max(0, $newQuantity),
            'status' => $closeFlock || $newQuantity <= 0 ? 'cloture' : 'actif',
        ]);

        return $generation;
    }
}

<?php

namespace App\Actions\Zootechnie;

use App\Models\Generation;
use Illuminate\Support\Facades\DB;

class UpdateFlockStatusAction
{
    public function execute(Generation $generation, int $quantityChange, bool $closeFlock = false): Generation
    {
        return DB::transaction(function () use ($generation, $quantityChange, $closeFlock) {
            $newQuantity = $generation->current_quantity + $quantityChange;

            $generation->update([
                'current_quantity' => max(0, $newQuantity),
                'status' => $closeFlock || $newQuantity <= 0 ? 'cloture' : 'actif',
            ]);

            return $generation;
        });
    }
}
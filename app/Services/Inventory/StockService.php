<?php

namespace App\Services\Inventory;

use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Model;

class StockService
{
    /**
     * Record a new stock movement.
     *
     * @param int $categoryId The category/item being moved
     * @param string $type 'in' for incoming, 'out' for outgoing
     * @param float $quantity The quantity in base unit
     * @param Model $reference The model instance that triggered the movement
     * @param string $date The date of the movement
     * @param int $userId The user who created the movement
     * @return StockMovement
     */
    public function recordMovement(
        int $categoryId,
        string $type,
        float $quantity,
        Model $reference,
        string $date,
        int $userId
    ): StockMovement {
        if (! in_array($type, ['in', 'out'])) {
            throw new \InvalidArgumentException("Invalid stock movement type: {$type}");
        }

        return StockMovement::create([
            'category_id' => $categoryId,
            'type' => $type,
            'quantity' => $quantity,
            'reference_type' => $reference->getMorphClass(),
            'reference_id' => $reference->getKey(),
            'date' => $date,
            'created_by' => $userId,
        ]);
    }
}

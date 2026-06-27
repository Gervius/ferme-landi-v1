<?php

namespace App\Actions\Stocks;

use App\Models\StockBalance;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final readonly class LogStockMovementAction
{
    public function execute(array $data, int $userId): StockMovement
    {
        return DB::transaction(function () use ($data, $userId) {
            $movementData = $data;
            $movementData['created_by'] = $userId;

            $movement = StockMovement::create($movementData);

            $balance = StockBalance::firstOrCreate(
                [
                    'site_id' => $data['site_id'],
                    'item_id' => $data['item_id'], // Cible l'Item
                    'unit_id' => $data['unit_id'],
                ],
                ['quantity' => 0]
            );

            $quantity = (float) $data['quantity'];
            $type = $data['type'];

            if ($type === 'in') {
                $balance->increment('quantity', $quantity);
            } elseif ($type === 'out') {
                // Délégation du contrôle de concurrence à PostgreSQL
                try {
                    $balance->decrement('quantity', $quantity);
                } catch (\Illuminate\Database\QueryException $e) {
                    // Code 23514 = Violation de la contrainte CHECK (quantity >= 0)
                    if ($e->getCode() === '23514') {
                        throw ValidationException::withMessages([
                            'quantity' => 'Stock insuffisant : une autre opération concurrente vient de consommer ce stock.',
                        ]);
                    }
                    throw $e;
                }
            } elseif ($type === 'adjustment') {
                $balance->update(['quantity' => $quantity]);
            } else {
                throw ValidationException::withMessages([
                    'type' => 'Type de mouvement non reconnu.',
                ]);
            }

            return $movement;
        });
    }
}
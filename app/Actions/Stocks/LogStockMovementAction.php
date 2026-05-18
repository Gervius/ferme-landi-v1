<?php

namespace App\Actions\Stocks;

use App\Models\StockBalance;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LogStockMovementAction
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
                    'category_id' => $data['category_id'],
                    'unit_id' => $data['unit_id'],
                ],
                ['quantity' => 0]
            );

            $quantity = (float) $data['quantity'];
            $type = $data['type'];

            if ($type === 'in') {
                $balance->quantity += $quantity;
            } elseif ($type === 'out') {
                if ($balance->quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'quantity' => 'Stock insuffisant pour cette opération.',
                    ]);
                }
                $balance->quantity -= $quantity;
            } elseif ($type === 'adjustment') {
                $balance->quantity = $quantity;
            } else {
                throw ValidationException::withMessages([
                    'type' => 'Type de mouvement non reconnu.',
                ]);
            }

            $balance->save();

            return $movement;
        });
    }
}

<?php

namespace App\Actions\Zootechnie;

use App\Models\DailyProduction;
use Illuminate\Support\Facades\DB;

final readonly class LogProductionAction
{
    /**
     * Log a new daily production record in draft status.
     *
     * @param array $data
     * @param int $userId
     * @return DailyProduction
     */
    public function execute(array $data, int $userId): DailyProduction
    {
        return DB::transaction(function () use ($data, $userId) {
            return DailyProduction::create([
                'generation_id' => $data['generation_id'],
                'date' => $data['date'],
                'unit_id' => $data['unit_id'],
                'item_category_id' => $data['item_category_id'] ?? null,
                'good_quantity' => $data['good_quantity'],
                'broken_quantity' => $data['broken_quantity'],
                'prepared_by' => $userId,
                // L'idéal serait d'avoir une constante dans ton modèle : DailyProduction::STATUS_DRAFT
                'status' => 'draft', 
            ]);
        });
    }
}
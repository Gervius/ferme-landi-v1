<?php

namespace App\Actions\Zootechnie;

use App\Models\DailyProduction;

class LogProductionAction
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
        $production = new DailyProduction();
        $production->generation_id = $data['generation_id'];
        $production->date = $data['date'];
        $production->unit_id = $data['unit_id'];
        $production->good_quantity = $data['good_quantity'];
        $production->broken_quantity = $data['broken_quantity'];
        $production->prepared_by = $userId;
        $production->status = 'draft';
        $production->save();

        return $production;
    }
}

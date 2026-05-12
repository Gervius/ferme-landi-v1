<?php

namespace App\Actions\Zootechnie;

use App\Models\FeedConsumption;

class LogFeedConsumptionAction
{
    /**
     * Log a new feed consumption record in draft status.
     *
     * @param array $data
     * @param int $userId
     * @return FeedConsumption
     */
    public function execute(array $data, int $userId): FeedConsumption
    {
        $consumption = new FeedConsumption();
        $consumption->generation_id = $data['generation_id'];
        $consumption->date = $data['date'];
        $consumption->item_category_id = $data['item_category_id'];
        $consumption->unit_id = $data['unit_id'];
        $consumption->quantity = $data['quantity'];
        $consumption->prepared_by = $userId;
        $consumption->status = 'draft';
        $consumption->save();

        return $consumption;
    }
}

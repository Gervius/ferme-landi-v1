<?php

namespace App\Actions\Zootechnie;

use App\Models\FeedConsumption;
use Illuminate\Support\Facades\DB;

final readonly class LogFeedConsumptionAction
{
    public function execute(array $data, int $userId): FeedConsumption
    {
        return DB::transaction(function () use ($data, $userId) {
            return FeedConsumption::create([
                'generation_id' => $data['generation_id'],
                'date' => $data['date'],
                'item_category_id' => $data['item_category_id'],
                'unit_id' => $data['unit_id'],
                'quantity' => $data['quantity'],
                'prepared_by' => $userId,
                'status' => 'draft',
            ]);
        });
    }
}
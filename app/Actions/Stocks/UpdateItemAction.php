<?php

namespace App\Actions\Stocks;

use App\Models\Item;
use Illuminate\Support\Facades\DB;

class UpdateItemAction
{
    public function execute(Item $item, array $data): Item
    {
        return DB::transaction(function () use ($item, $data) {
            $item->update($data);
            return $item;
        });
    }
}
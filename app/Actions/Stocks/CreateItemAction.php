<?php

namespace App\Actions\Logistics;

use App\Models\Item;
use Illuminate\Support\Facades\DB;

class CreateItemAction
{
    public function execute(array $data): Item
    {
        return DB::transaction(function () use ($data) {
            return Item::create($data);
        });
    }
}
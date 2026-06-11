<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockMortality;
use Illuminate\Support\Facades\DB;

class LogMortalityAction
{
    public function execute(array $data, int $preparedById): FlockMortality
    {
        return DB::transaction(function () use ($data, $preparedById) {
            $data['status'] = 'draft';
            $data['prepared_by'] = $preparedById;

            return FlockMortality::create($data);
        });
    }
}
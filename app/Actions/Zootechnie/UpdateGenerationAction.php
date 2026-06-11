<?php

namespace App\Actions\Zootechnie;

use App\Models\Generation;
use Illuminate\Support\Facades\DB;

class UpdateGenerationAction
{
    public function execute(Generation $generation, array $data): Generation
    {
        return DB::transaction(function () use ($generation, $data) {
            $generation->update($data);
            return $generation;
        });
    }
}
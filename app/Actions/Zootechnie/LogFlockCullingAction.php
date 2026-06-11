<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockCulling;
use Illuminate\Support\Facades\DB;

class LogFlockCullingAction
{
    public function execute(array $data, int $preparedById): FlockCulling
    {
        return DB::transaction(function () use ($data, $preparedById) {
            $data['status'] = 'draft';
            $data['prepared_by'] = $preparedById;

            if (!isset($data['quantity_culled']) && isset($data['quantity'])) {
                $data['quantity_culled'] = $data['quantity'];
            }

            return FlockCulling::create($data);
        });
    }
}
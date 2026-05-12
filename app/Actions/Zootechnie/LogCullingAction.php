<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockCulling;

class LogCullingAction
{
    /**
     * Logs culling to a draft status.
     */
    public function execute(array $data, int $preparedById): FlockCulling
    {
        $data['status'] = 'draft';
        $data['prepared_by'] = $preparedById;

        return FlockCulling::create($data);
    }
}

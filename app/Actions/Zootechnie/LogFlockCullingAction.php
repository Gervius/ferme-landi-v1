<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockCulling;

class LogFlockCullingAction
{
    /**
     * Logs culling to a draft status.
     */
    public function execute(array $data, int $preparedById): FlockCulling
    {
        $data['status'] = 'draft';
        $data['prepared_by'] = $preparedById;

        // S'assurer d'injecter quantity_culled (même si ça vient du FormRequest validé)
        if (!isset($data['quantity_culled']) && isset($data['quantity'])) {
            $data['quantity_culled'] = $data['quantity'];
        }

        return FlockCulling::create($data);
    }
}

<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockWeighing;

class LogWeighingAction
{
    /**
     * Log a new flock weighing record in draft status.
     *
     * @param array $data
     * @param int $userId
     * @return FlockWeighing
     */
    public function execute(array $data, int $userId): FlockWeighing
    {
        $data['status'] = 'draft';
        $data['prepared_by'] = $userId;

        return FlockWeighing::create($data);
    }
}

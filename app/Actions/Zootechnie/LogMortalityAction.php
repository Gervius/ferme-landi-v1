<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockMortality;

class LogMortalityAction
{
    /**
     * Logs mortality to a draft status without modifying the flock quantity.
     */
    public function execute(array $data, int $preparedById): FlockMortality
    {
        $data['status'] = 'draft';
        $data['prepared_by'] = $preparedById;

        return FlockMortality::create($data);
    }
}

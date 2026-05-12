<?php

namespace App\Actions\Zootechnie;

use App\Models\Generation;

class UpdateGenerationAction
{
    /**
     * Updates an existing generation.
     */
    public function execute(Generation $generation, array $data): Generation
    {
        $generation->update($data);

        return $generation;
    }
}

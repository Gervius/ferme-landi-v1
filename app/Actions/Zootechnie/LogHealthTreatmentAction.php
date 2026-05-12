<?php

namespace App\Actions\Zootechnie;

use App\Models\HealthTreatment;

class LogHealthTreatmentAction
{
    /**
     * Log a new health treatment record in draft status.
     *
     * @param array $data
     * @param int $userId
     * @return HealthTreatment
     */
    public function execute(array $data, int $userId): HealthTreatment
    {
        $data['status'] = 'draft';
        $data['prepared_by'] = $userId;

        return HealthTreatment::create($data);
    }
}

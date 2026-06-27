<?php

namespace App\Actions\Zootechnie;

use App\Models\HealthTreatment;
use Illuminate\Support\Facades\DB;

final readonly class LogHealthTreatmentAction
{
    public function execute(array $data, int $userId): HealthTreatment
    {
        return DB::transaction(function () use ($data, $userId) {
            $data['status'] = 'draft';
            $data['prepared_by'] = $userId;

            return HealthTreatment::create($data);
        });
    }
}
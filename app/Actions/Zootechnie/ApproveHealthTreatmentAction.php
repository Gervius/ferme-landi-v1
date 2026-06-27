<?php

namespace App\Actions\Zootechnie;

use App\Models\HealthTreatment;

final readonly class ApproveHealthTreatmentAction
{
    /**
     * Approve a health treatment record.
     *
     * @param HealthTreatment $treatment
     * @param int $approverId
     * @return HealthTreatment
     */
    public function execute(HealthTreatment $treatment, int $approverId): HealthTreatment
    {
        if (! $treatment->isDraft()) {
            throw new \InvalidArgumentException("Only draft health treatments can be approved.");
        }

        return \Illuminate\Support\Facades\DB::transaction(function () use ($treatment, $approverId) {
            // Approve the record
            $treatment->approve($approverId);

            return $treatment;
        });
    }
}
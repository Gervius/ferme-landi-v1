<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockWeighing;

class ApproveWeighingAction
{
    /**
     * Approve a flock weighing record.
     *
     * @param FlockWeighing $weighing
     * @param int $approverId
     * @return FlockWeighing
     */
    public function execute(FlockWeighing $weighing, int $approverId): FlockWeighing
    {
        if (! $weighing->isDraft()) {
            throw new \InvalidArgumentException("Only draft weighing records can be approved.");
        }

        return \Illuminate\Support\Facades\DB::transaction(function () use ($weighing, $approverId) {
            // Approve the record
            $weighing->approve($approverId);

            return $weighing;
        });
    }
}

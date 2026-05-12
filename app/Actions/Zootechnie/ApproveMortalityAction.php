<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockMortality;
use Illuminate\Support\Facades\DB;

class ApproveMortalityAction
{
    public function __construct(private readonly UpdateFlockStatusAction $updateFlockStatusAction) {}

    /**
     * Approves mortality record and impacts the flock quantity.
     */
    public function execute(FlockMortality $mortality, int $approverId): FlockMortality
    {
        DB::transaction(function () use ($mortality, $approverId) {
            $mortality->approve($approverId);

            // Note the negation to subtract the quantity
            $this->updateFlockStatusAction->execute($mortality->generation, -$mortality->quantity);
        });

        return $mortality;
    }
}

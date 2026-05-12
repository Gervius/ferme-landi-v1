<?php

namespace App\Actions\Zootechnie;

use App\Models\FlockCulling;
use Illuminate\Support\Facades\DB;

class ApproveCullingAction
{
    public function __construct(private readonly UpdateFlockStatusAction $updateFlockStatusAction) {}

    /**
     * Approves culling record and impacts the flock quantity.
     */
    public function execute(FlockCulling $culling, int $approverId): FlockCulling
    {
        DB::transaction(function () use ($culling, $approverId) {
            $culling->approve($approverId);

            $this->updateFlockStatusAction->execute($culling->generation, -$culling->quantity_culled);

            // TODO: Inject this quantity into finished goods inventory (Category: "Poules Réformées") for sale.
        });

        return $culling;
    }
}

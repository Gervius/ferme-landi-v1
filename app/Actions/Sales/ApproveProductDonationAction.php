<?php

namespace App\Actions\Sales;

use App\Models\ProductDonation;
use App\Actions\Stocks\LogStockMovementAction;
use Illuminate\Support\Facades\DB;

class ApproveProductDonationAction
{
    public function __construct(
        private readonly LogStockMovementAction $logStockMovementAction
    ) {}

    public function execute(ProductDonation $donation, int $approverId): ProductDonation
    {
        if (! $donation->isDraft()) {
            throw new \InvalidArgumentException("Only draft product donations can be approved.");
        }

        return DB::transaction(function () use ($donation, $approverId) {
            $donation->approve($approverId);

            $this->logStockMovementAction->execute([
                'site_id' => $donation->site_id,
                'item_id' => $donation->item_id, // Ciblage physique
                'type' => 'out',
                'quantity' => $donation->quantity,
                'date' => $donation->date->format('Y-m-d'),
                'reference_type' => ProductDonation::class,
                'reference_id' => $donation->id,
            ], $approverId);

            return $donation;
        });
    }
}
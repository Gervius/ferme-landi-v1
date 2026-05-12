<?php

namespace App\Actions\Sales;

use App\Models\ProductDonation;
use App\Services\Inventory\StockService;
use App\Services\Logistics\UnitConversionService;
use Illuminate\Support\Facades\DB;

class ApproveProductDonationAction
{
    public function __construct(
        private readonly UnitConversionService $unitConversionService,
        private readonly StockService $stockService
    ) {
    }

    /**
     * Approve a product donation and deduct from stock.
     *
     * @param ProductDonation $donation
     * @param int $approverId
     * @return ProductDonation
     */
    public function execute(ProductDonation $donation, int $approverId): ProductDonation
    {
        if (! $donation->isDraft()) {
            throw new \InvalidArgumentException("Only draft product donations can be approved.");
        }

        return DB::transaction(function () use ($donation, $approverId) {
            $donation->approve($approverId);

            $baseQuantity = $this->unitConversionService->toBase($donation->quantity, $donation->unit);

            $this->stockService->recordMovement(
                $donation->category_id,
                'out',
                $baseQuantity,
                $donation,
                $donation->date->format('Y-m-d'),
                $approverId
            );

            return $donation;
        });
    }
}

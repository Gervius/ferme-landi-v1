<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseReceipt;
use App\Services\Inventory\StockService;
use App\Services\Inventory\UnitConversionService;
use Illuminate\Support\Facades\DB;

class ApprovePurchaseReceiptAction
{
    protected UnitConversionService $conversionService;
    protected StockService $stockService;

    public function __construct(UnitConversionService $conversionService, StockService $stockService)
    {
        $this->conversionService = $conversionService;
        $this->stockService = $stockService;
    }

    public function execute(PurchaseReceipt $receipt, int $userId): PurchaseReceipt
    {
        return DB::transaction(function () use ($receipt, $userId) {
            $receipt->update([
                'status' => 'approved',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            foreach ($receipt->items as $item) {
                $baseQuantity = $this->conversionService->convertToBase($item->received_quantity, $item->unit_id);

                $this->stockService->recordMovement(
                    reference: $receipt,
                    categoryId: $item->category_id,
                    quantity: $baseQuantity,
                    direction: 'in'
                );
            }

            return $receipt;
        });
    }
}

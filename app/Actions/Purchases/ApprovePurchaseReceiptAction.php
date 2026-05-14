<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseReceipt;
use App\Services\Inventory\StockService;
use App\Services\Logistics\UnitConversionService;
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
                $baseQuantity = $this->conversionService->toBase($item->received_quantity, $item->unit);

                $this->stockService->recordMovement(
                    $item->category_id,
                    'in', // C'est bien une entrée de stock
                    $baseQuantity,
                    $receipt,
                    $receipt->receipt_date->format('Y-m-d'),
                    $userId
                );
            }

            return $receipt;
        });
    }
}

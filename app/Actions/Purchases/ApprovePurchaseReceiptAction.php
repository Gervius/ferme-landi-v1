<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseReceipt;
use App\Actions\Stocks\LogStockMovementAction;
use App\Services\Logistics\UnitConversionService;
use Illuminate\Support\Facades\DB;

class ApprovePurchaseReceiptAction
{
    protected UnitConversionService $conversionService;
    protected LogStockMovementAction $logStockMovementAction;

    public function __construct(UnitConversionService $conversionService, LogStockMovementAction $logStockMovementAction)
    {
        $this->conversionService = $conversionService;
        $this->logStockMovementAction = $logStockMovementAction;
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
                // Here we pass the raw item quantities, but logic requires passing the base quantity if unit_id is base?
                // The prompt says: "quantity (quantité reçue)" but legacy code uses toBase.
                // Actually, I'll pass the received quantity and the unit_id from the item to LogStockMovementAction.
                // The prompt specifically instructs: Mappage : site_id (du bon de réception), category_id, unit_id, quantity (quantité reçue), date (date de réception), type => 'in'.

                $this->logStockMovementAction->execute([
                    'site_id' => $receipt->site_id,
                    'category_id' => $item->category_id,
                    'unit_id' => $item->unit_id,
                    'type' => 'in',
                    'quantity' => $item->received_quantity,
                    'date' => $receipt->receipt_date->format('Y-m-d'),
                    'reference_type' => get_class($receipt),
                    'reference_id' => $receipt->id,
                ], $userId);
            }

            return $receipt;
        });
    }
}

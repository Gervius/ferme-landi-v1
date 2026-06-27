<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseReceipt;
use App\Actions\Stocks\LogStockMovementAction;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApprovePurchaseReceiptAction
{
    public function __construct(
        protected LogStockMovementAction $logStockMovementAction
    ) {}

    public function execute(PurchaseReceipt $receipt, int $userId): PurchaseReceipt
    {
        // 1. Protection d'Idempotence : On bloque la double approbation
        if (in_array($receipt->status, ['approved', 'validated'])) {
            throw ValidationException::withMessages([
                'status' => 'Ce bon de réception a déjà été traité et injecté dans les stocks.',
            ]);
        }

        // 2. Élimination du N+1 : On charge les items en RAM en une seule requête
        $receipt->loadMissing('items');

        return DB::transaction(function () use ($receipt, $userId) {
            $receipt->update([
                'status' => 'approved',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            // 3. Boucle d'injection dans les stocks via l'Action atomique
            foreach ($receipt->items as $item) {
                $this->logStockMovementAction->execute([
                    'site_id' => $receipt->site_id,
                    'item_id' => $item->item_id, // Remplacement de category_id
                    'unit_id' => $item->unit_id,
                    'type' => 'in',
                    'quantity' => $item->received_quantity, // Quantité physique reçue[cite: 20]
                    'date' => $receipt->receipt_date->format('Y-m-d'),
                    'reference_type' => get_class($receipt),
                    'reference_id' => $receipt->id,
                ], $userId);
            }

            return $receipt;
        });
    }
}
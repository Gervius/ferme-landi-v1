<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseReceipt;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdatePurchaseReceiptAction
{
    public function execute(PurchaseReceipt $receipt, array $data): PurchaseReceipt
    {
        // 1. Verrou de sécurité : on ne modifie pas un bon déjà entré en stock
        if ($receipt->status !== 'draft') {
            throw ValidationException::withMessages([
                'status' => 'Impossible de modifier un bon de réception qui a déjà été approuvé et intégré aux stocks.',
            ]);
        }

        return DB::transaction(function () use ($receipt, $data) {
            // 2. Mise à jour de l'entête
            $receipt->update([
                'site_id'           => $data['site_id'],
                'purchase_order_id' => $data['purchase_order_id'] ?? $receipt->purchase_order_id,
                'receipt_date'      => $data['receipt_date'],
            ]);

            // 3. Remplacement des lignes matérielles (Élimination N+1)
            if (isset($data['items'])) {
                // Sûr car le statut est 'draft'
                $receipt->items()->delete();
                
                $itemsData = array_map(function ($item) {
                    return [
                        'purchase_order_item_id' => $item['purchase_order_item_id'] ?? null,
                        'item_id'                => $item['item_id'],
                        'unit_id'                => $item['unit_id'],
                        'received_quantity'      => $item['received_quantity'],
                    ];
                }, $data['items']);
                
                $receipt->items()->createMany($itemsData);
            }

            return $receipt;
        });
    }
}
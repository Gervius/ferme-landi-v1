<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UpdatePurchaseOrderAction
{
    public function execute(PurchaseOrder $order, array $data): PurchaseOrder
    {
        // 1. Verrou de sécurité absolu
        if ($order->status !== 'draft') {
            throw ValidationException::withMessages([
                'status' => 'Impossible de modifier une commande qui n\'est plus à l\'état de brouillon. Vous devez l\'annuler et en créer une nouvelle.',
            ]);
        }

        return DB::transaction(function () use ($order, $data) {
            $order->update([
                'supplier_id' => $data['supplier_id'],
                'order_date'  => $data['order_date'],
                'reference'   => $data['reference'],
                // Ne jamais autoriser la modification du status par cette action, 
                // le status doit être géré par des Actions d'approbation dédiées.
            ]);

            if (isset($data['items'])) {
                // Seulement sûr parce que le statut est 'draft' et qu'aucune réception n'y est liée
                $order->items()->delete();
                foreach ($data['items'] as $item) {
                    $order->items()->create([
                        'item_id'     => $item['item_id'], // Modification ici (au lieu de category_id)
                        'unit_id'     => $item['unit_id'],
                        'quantity'    => $item['quantity'],
                        'unit_price'  => $item['unit_price'],
                    ]);
                }
            }

            return $order;
        });
    }
}
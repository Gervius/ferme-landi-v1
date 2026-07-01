<?php

namespace App\Actions\Purchases;

use App\Models\PurchaseOrder;
use Illuminate\Validation\ValidationException;

class ApprovePurchaseOrderAction
{
    public function execute(PurchaseOrder $order, int $approverId): PurchaseOrder
    {
        if ($order->status !== 'draft') {
            throw ValidationException::withMessages([
                'status' => 'Seules les commandes en brouillon peuvent être validées.',
            ]);
        }

        $order->update([
            'status' => 'validated',
            // Optionnel: 'approved_by' => $approverId, (si la colonne existe dans ta BDD)
        ]);

        return $order;
    }
}
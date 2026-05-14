<?php

namespace App\Actions\Purchases;

use App\Models\SupplierInvoice;
use Illuminate\Support\Facades\DB;

class ApproveSupplierInvoiceAction
{
    public function execute(SupplierInvoice $invoice, int $userId): SupplierInvoice
    {
        return DB::transaction(function () use ($invoice, $userId) {
            $invoice->update([
                'status' => 'validated',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            return $invoice;
        });
    }
}

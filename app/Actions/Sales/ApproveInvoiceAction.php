<?php

namespace App\Actions\Sales;

use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class ApproveInvoiceAction
{
    /**
     * Approve an invoice (validates it).
     */
    public function execute(Invoice $invoice, int $approverId): Invoice
    {
        if (! $invoice->isDraft()) {
            throw new \InvalidArgumentException("Only draft invoices can be approved.");
        }

        return DB::transaction(function () use ($invoice, $approverId) {
            $invoice->update([
                'status' => 'validated',
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            return $invoice;
        });
    }
}

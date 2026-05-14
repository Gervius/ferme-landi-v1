<?php

namespace App\Actions\Purchases;

use App\Models\SupplierInvoice;
use Illuminate\Support\Facades\DB;

class LogSupplierInvoiceAction
{
    public function execute(array $data, int $userId): SupplierInvoice
    {
        return DB::transaction(function () use ($data, $userId) {
            $invoice = SupplierInvoice::create([
                'supplier_id'         => $data['supplier_id'],
                'purchase_receipt_id' => $data['purchase_receipt_id'],
                'invoice_date'        => $data['invoice_date'],
                'due_date'            => $data['due_date'] ?? null,
                'reference'           => $data['reference'],
                'total_amount'        => 0, // Recalculated below
                'status'              => 'draft',
                'prepared_by'         => $userId,
            ]);

            $totalAmount = 0;

            foreach ($data['items'] as $item) {
                $totalPrice = $item['quantity'] * $item['unit_price'];
                $totalAmount += $totalPrice;

                $invoice->items()->create([
                    'purchase_receipt_item_id' => $item['purchase_receipt_item_id'] ?? null,
                    'description'              => $item['description'] ?? null,
                    'quantity'                 => $item['quantity'],
                    'unit_price'               => $item['unit_price'],
                    'total_price'              => $totalPrice,
                ]);
            }

            $invoice->update(['total_amount' => $totalAmount]);

            return $invoice;
        });
    }
}

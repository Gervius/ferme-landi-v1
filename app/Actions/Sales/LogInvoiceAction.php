<?php

namespace App\Actions\Sales;

use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class LogInvoiceAction
{
    /**
     * Log a new invoice record in draft status.
     */
    public function execute(array $data, int $userId): Invoice
    {
        return DB::transaction(function () use ($data, $userId) {
            $invoice = Invoice::create([
                'customer_id' => $data['customer_id'],
                'delivery_note_id' => $data['delivery_note_id'],
                'invoice_date' => $data['invoice_date'],
                'due_date' => $data['due_date'],
                'reference' => $data['reference'],
                'status' => 'draft',
                'prepared_by' => $userId,
                'total_amount' => 0, // will be calculated below
            ]);

            $totalAmount = 0;

            if (isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    $totalPrice = $item['quantity'] * $item['unit_price'];
                    $totalAmount += $totalPrice;

                    $invoice->items()->create([
                        'delivery_note_item_id' => $item['delivery_note_item_id'],
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $totalPrice,
                    ]);
                }
            }

            $invoice->update(['total_amount' => $totalAmount]);

            return $invoice;
        });
    }
}

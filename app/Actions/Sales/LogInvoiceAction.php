<?php

namespace App\Actions\Sales;

use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class LogInvoiceAction
{
    public function execute(array $data, int $userId): Invoice
    {
        return DB::transaction(function () use ($data, $userId) {
            $seq = DB::scalar("SELECT nextval('invoice_ref_seq')");

            $invoice = Invoice::create([
                'site_id' => $data['site_id'],
                'customer_id' => $data['customer_id'],
                'delivery_note_id' => $data['delivery_note_id'],
                'invoice_date' => $data['invoice_date'],
                'due_date' => $data['due_date'],
                'reference' => 'FACT-' . str_pad($seq, 5, '0', STR_PAD_LEFT),
                'status' => 'draft',
                'prepared_by' => $userId,
                'total_amount' => 0,
            ]);

            $totalAmount = 0;
            $itemsData = [];

            if (isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    $totalPrice = $item['quantity'] * $item['unit_price'];
                    $totalAmount += $totalPrice;

                    $itemsData[] = [
                        'delivery_note_item_id' => $item['delivery_note_item_id'],
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $totalPrice,
                    ];
                }

                $invoice->items()->createMany($itemsData); // Batch insert
            }

            $invoice->update(['total_amount' => $totalAmount]);

            return $invoice;
        });
    }
}
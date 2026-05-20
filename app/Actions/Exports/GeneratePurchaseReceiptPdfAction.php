<?php

namespace App\Actions\Exports;

use App\Models\PurchaseReceipt;
use Barryvdh\DomPDF\Facade\Pdf;

class GeneratePurchaseReceiptPdfAction
{
    public function execute(PurchaseReceipt $receipt)
    {
        $receipt->load(['site', 'purchaseOrder.supplier', 'items.category', 'items.unit']);

        $pdf = Pdf::loadView('pdf.purchase_receipt', ['document' => $receipt]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }
}

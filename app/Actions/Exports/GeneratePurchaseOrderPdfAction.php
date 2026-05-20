<?php

namespace App\Actions\Exports;

use App\Models\PurchaseOrder;
use Barryvdh\DomPDF\Facade\Pdf;

class GeneratePurchaseOrderPdfAction
{
    public function execute(PurchaseOrder $order)
    {
        $order->load(['site', 'supplier', 'items.category', 'items.unit']);

        $pdf = Pdf::loadView('pdf.purchase_order', ['document' => $order]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }
}

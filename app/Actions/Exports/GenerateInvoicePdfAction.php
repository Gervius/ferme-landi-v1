<?php

namespace App\Actions\Exports;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateInvoicePdfAction
{
    public function execute(Invoice $invoice)
    {
        $invoice->load(['customer', 'deliveryNote.site', 'items.category', 'items.unit']);

        $pdf = Pdf::loadView('pdf.invoice', ['document' => $invoice]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }
}

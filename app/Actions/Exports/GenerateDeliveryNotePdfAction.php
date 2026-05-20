<?php

namespace App\Actions\Exports;

use App\Models\DeliveryNote;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateDeliveryNotePdfAction
{
    public function execute(DeliveryNote $note)
    {
        $note->load(['site', 'saleOrder.customer', 'items.category', 'items.unit']);

        $pdf = Pdf::loadView('pdf.delivery_note', ['document' => $note]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }
}

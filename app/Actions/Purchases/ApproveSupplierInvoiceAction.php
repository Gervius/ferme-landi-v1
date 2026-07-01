<?php

namespace App\Actions\Purchases;

use App\Actions\Accounting\MapAndLogAccountingEntryAction;
use App\Models\AccountingMapping;
use App\Models\AnalyticalCenter;
use App\Models\SupplierInvoice;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final readonly class ApproveSupplierInvoiceAction
{
    public function __construct(
        private MapAndLogAccountingEntryAction $mapAndLogAccountingEntryAction
    ) {}

    public function execute(SupplierInvoice $invoice, int $userId): SupplierInvoice
    {
        // CORRECTION 1 : On vérifie 'approved' au lieu de 'validated'
        if ($invoice->status === 'approved') {
            throw ValidationException::withMessages(['status' => 'Cette facture est déjà validée en comptabilité.']);
        }

        // CORRECTION 1 : Eager Loading via le purchaseReceiptItem
        $invoice->loadMissing(['items.purchaseReceiptItem.item.category']);

        return DB::transaction(function () use ($invoice, $userId) {
            $invoice->update([
                // CORRECTION 2 : On sauvegarde 'approved' pour que React le reconnaisse
                'status' => 'approved', 
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            $mapping = AccountingMapping::where('event_type', 'supplier_invoice')->firstOrFail();
            $centers = AnalyticalCenter::where('analytical_nature_id', $mapping->analytical_nature_id)
                ->pluck('id', 'analytical_code_id');

            $movements = [];

            // 1. Ventilation des Charges (Débit) par ligne de facture
            foreach ($invoice->items as $invoiceItem) {
                $amountHt = (int) round($invoiceItem->quantity * $invoiceItem->unit_price, 0);
                $centerId = null;

                // CORRECTION 2 : Traversée sécurisée jusqu'à la catégorie de l'article
                $category = $invoiceItem->purchaseReceiptItem?->item?->category;
                
                if ($category && $category->analytical_code_id) {
                    $centerId = $centers[$category->analytical_code_id] ?? null;
                }

                $movements[] = [
                    'type' => 'debit',
                    'amount' => $amountHt,
                    'analytical_center_id' => $centerId,
                ];
            }

            // 2. Dette globale Fournisseur (Crédit)
            $movements[] = [
                'type' => 'credit',
                'amount' => (int) $invoice->total_amount,
                'analytical_center_id' => null,
            ];

            $this->mapAndLogAccountingEntryAction->execute(
                eventType: 'supplier_invoice',
                reference: $invoice->reference ?? 'SUP-INV-' . $invoice->id,
                description: 'Facture Fournisseur ' . ($invoice->reference ?? $invoice->id),
                date: $invoice->invoice_date->format('Y-m-d'),
                movements: $movements
            );

            return $invoice;
        });
    }
}
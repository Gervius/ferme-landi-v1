<?php

namespace App\Actions\Sales;

use App\Actions\Accounting\MapAndLogAccountingEntryAction;
use App\Models\AccountingMapping;
use App\Models\AnalyticalCenter;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final readonly class ApproveInvoiceAction
{
    public function __construct(
        private MapAndLogAccountingEntryAction $mapAndLogAccountingEntryAction
    ) {}

    public function execute(Invoice $invoice, int $approverId): Invoice
    {
        if (! $invoice->isDraft()) {
            throw new InvalidArgumentException("Seules les factures en brouillon peuvent être validées.");
        }

        return DB::transaction(function () use ($invoice, $approverId) {
            $invoice->update([
                'status' => 'validated',
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            // Eager Loading ultra-strict (zéro N+1)
            $invoice->loadMissing(['items.deliveryNoteItem.item.category']);

            // 1. Récupération du Mapping pour connaître la Nature Analytique des Ventes
            $mapping = AccountingMapping::where('event_type', 'customer_invoice')->firstOrFail();
            
            // 2. Pré-chargement des centres analytiques de cette nature pour éviter les requêtes dans la boucle
            $centers = AnalyticalCenter::where('analytical_nature_id', $mapping->analytical_nature_id)
                ->pluck('id', 'analytical_code_id');

            $movements = [];
            
            // 3. Créance globale du client (Débit) - Typage strict Entier
            $movements[] = [
                'type' => 'debit',
                'amount' => (int) $invoice->total_amount,
                'analytical_center_id' => null,
            ];

            // 4. Ventilation du Chiffre d'Affaires par produit (Crédit)
            foreach ($invoice->items as $item) {
                $amountHt = (int) round($item->quantity * $item->unit_price, 0);
                $centerId = null;

                $category = $item->deliveryNoteItem?->item?->category;
                
                if ($category && $category->analytical_code_id) {
                    $centerId = $centers[$category->analytical_code_id] ?? null;
                }

                $movements[] = [
                    'type' => 'credit',
                    'amount' => $amountHt,
                    'analytical_center_id' => $centerId,
                ];
            }

            $this->mapAndLogAccountingEntryAction->execute(
                eventType: 'customer_invoice',
                reference: $invoice->reference ?? 'FAC-' . $invoice->id,
                description: 'Facture Client ' . ($invoice->reference ?? $invoice->id),
                date: $invoice->invoice_date->format('Y-m-d'),
                movements: $movements
            );

            return $invoice;
        });
    }
}
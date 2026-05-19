<?php

namespace App\Actions\Purchases;

use App\Actions\Accounting\LogAccountingEntryAction;
use App\Models\Account;
use App\Models\AccountingJournal;
use App\Models\AnalyticalCenter;
use App\Models\AnalyticalNature;
use App\Models\FinancialYear;
use App\Models\SupplierInvoice;
use App\Enums\CategoryScope;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApproveSupplierInvoiceAction
{
    public function __construct(
        private readonly LogAccountingEntryAction $logAccountingEntryAction
    ) {
    }

    public function execute(SupplierInvoice $invoice, int $userId): SupplierInvoice
    {
        return DB::transaction(function () use ($invoice, $userId) {
            $invoice->update([
                'status' => 'validated',
                'approved_by' => $userId,
                'approved_at' => now(),
            ]);

            $financialYear = FinancialYear::where('is_closed', false)
                ->where('start_date', '<=', $invoice->invoice_date)
                ->where('end_date', '>=', $invoice->invoice_date)
                ->first();

            if (! $financialYear) {
                throw ValidationException::withMessages([
                    'invoice_date' => 'Aucun exercice comptable actif trouvé pour la date de cette facture.',
                ]);
            }

            $journal = AccountingJournal::where('code', AccountingJournal::CODE_PURCHASES)->firstOrFail();

            $supplierAccount = Account::where('number', Account::CODE_SUPPLIERS)->firstOrFail();
            $purchasesAccount = Account::where('number', Account::CODE_PURCHASES)->firstOrFail();

            $purchasesNature = AnalyticalNature::where('code', AnalyticalNature::CODE_PURCHASES)->firstOrFail();
            $healthNature = AnalyticalNature::where('code', AnalyticalNature::CODE_HEALTH)->firstOrFail();

            $lines = [];

            // Debit Lines (Purchases)
            foreach ($invoice->items as $item) {
                $amountHt = round($item->quantity * $item->unit_price, 2);

                $centerId = null;
                if ($item->category && $item->category->analytical_code_id) {
                    $natureId = ($item->category->scope === CategoryScope::MEDICATION)
                        ? $healthNature->id
                        : $purchasesNature->id;

                    $center = AnalyticalCenter::where('analytical_nature_id', $natureId)
                        ->where('analytical_code_id', $item->category->analytical_code_id)
                        ->first();

                    if ($center) {
                        $centerId = $center->id;
                    }
                }

                $lines[] = [
                    'account_id' => $purchasesAccount->id,
                    'debit' => $amountHt,
                    'credit' => 0,
                    'analytical_center_id' => $centerId,
                ];
            }

            // Credit Line (Supplier)
            $lines[] = [
                'account_id' => $supplierAccount->id,
                'debit' => 0,
                'credit' => $invoice->total_amount,
                'analytical_center_id' => null,
            ];

            $entryData = [
                'financial_year_id' => $financialYear->id,
                'accounting_journal_id' => $journal->id,
                'date' => $invoice->invoice_date->format('Y-m-d'),
                'reference' => $invoice->reference ?? 'SUP-INV-' . $invoice->id,
                'description' => 'Facture Fournisseur ' . ($invoice->reference ?? $invoice->id),
                'lines' => $lines,
            ];

            $this->logAccountingEntryAction->execute($entryData);

            return $invoice;
        });
    }
}

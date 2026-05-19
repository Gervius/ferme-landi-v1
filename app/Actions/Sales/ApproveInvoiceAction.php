<?php

namespace App\Actions\Sales;

use App\Actions\Accounting\LogAccountingEntryAction;
use App\Models\Account;
use App\Models\AccountingJournal;
use App\Models\AnalyticalCenter;
use App\Models\AnalyticalNature;
use App\Models\FinancialYear;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApproveInvoiceAction
{
    public function __construct(
        private readonly LogAccountingEntryAction $logAccountingEntryAction
    ) {
    }

    /**
     * Approve an invoice (validates it).
     */
    public function execute(Invoice $invoice, int $approverId): Invoice
    {
        if (! $invoice->isDraft()) {
            throw new \InvalidArgumentException("Only draft invoices can be approved.");
        }

        return DB::transaction(function () use ($invoice, $approverId) {
            $invoice->update([
                'status' => 'validated',
                'approved_by' => $approverId,
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

            $journal = AccountingJournal::where('code', AccountingJournal::CODE_SALES)->firstOrFail();

            $clientAccount = Account::where('number', Account::CODE_CLIENTS)->firstOrFail();
            $salesAccount = Account::where('number', Account::CODE_SALES)->firstOrFail();

            $salesNature = AnalyticalNature::where('code', AnalyticalNature::CODE_SALES)->firstOrFail();

            $lines = [];

            // Debit Line (Client)
            $lines[] = [
                'account_id' => $clientAccount->id,
                'debit' => $invoice->total_amount,
                'credit' => 0,
                'analytical_center_id' => null,
            ];

            // Credit Lines (Sales)
            foreach ($invoice->items as $item) {
                $amountHt = round($item->quantity * $item->unit_price, 2);

                $centerId = null;
                if ($item->category && $item->category->analytical_code_id) {
                    $center = AnalyticalCenter::where('analytical_nature_id', $salesNature->id)
                        ->where('analytical_code_id', $item->category->analytical_code_id)
                        ->first();

                    if ($center) {
                        $centerId = $center->id;
                    }
                }

                $lines[] = [
                    'account_id' => $salesAccount->id,
                    'debit' => 0,
                    'credit' => $amountHt,
                    'analytical_center_id' => $centerId,
                ];
            }

            $entryData = [
                'financial_year_id' => $financialYear->id,
                'accounting_journal_id' => $journal->id,
                'date' => $invoice->invoice_date->format('Y-m-d'),
                'reference' => $invoice->reference ?? 'INV-' . $invoice->id,
                'description' => 'Facture Client ' . ($invoice->reference ?? $invoice->id),
                'lines' => $lines,
            ];

            $this->logAccountingEntryAction->execute($entryData);

            return $invoice;
        });
    }
}

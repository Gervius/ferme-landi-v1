<?php

namespace App\Actions\Accounting;

use App\Models\AccountingMapping;
use App\Models\FinancialYear;
use Illuminate\Validation\ValidationException;

final readonly class MapAndLogAccountingEntryAction
{
    public function __construct(
        private LogAccountingEntryAction $logAccountingEntryAction
    ) {}

    /**
     * @param string $eventType Identifiant de l'événement (ex: 'customer_invoice')
     * @param string $reference Référence unique (ex: 'FAC-2026-001')
     * @param string $description Libellé de l'écriture
     * @param string $date Date au format Y-m-d
     * @param array $movements Tableau des flux : [['type' => 'debit'|'credit', 'amount' => int, 'analytical_center_id' => ?int]]
     */
    public function execute(
        string $eventType,
        string $reference,
        string $description,
        string $date,
        array $movements
    ): void {
        // 1. Récupération dynamique des comptes paramétrés par l'utilisateur
        $mapping = AccountingMapping::where('event_type', $eventType)->first();

        if (! $mapping) {
            throw ValidationException::withMessages([
                'accounting' => "Configuration comptable introuvable pour l'événement : {$eventType}. Veuillez configurer le mapping comptable.",
            ]);
        }

        // 2. Identification de l'exercice fiscal actif
        $financialYear = FinancialYear::select('id')
            ->where('is_closed', false)
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->first();

        if (! $financialYear) {
            throw ValidationException::withMessages([
                'financial_year' => "Aucun exercice comptable actif ne correspond à la date : {$date}.",
            ]);
        }

        // 3. Traduction des flux métiers en lignes comptables strictes
        $lines = [];

        foreach ($movements as $movement) {
            $isDebit = $movement['type'] === 'debit';
            
            $lines[] = [
                'account_id' => $isDebit ? $mapping->debit_account_id : $mapping->credit_account_id,
                // Le montant reçu DOIT être un entier (centimes) pour éviter les failles de flottants
                'debit' => $isDebit ? $movement['amount'] : 0,
                'credit' => ! $isDebit ? $movement['amount'] : 0,
                'analytical_center_id' => $movement['analytical_center_id'] ?? null,
                'description' => $description,
            ];
        }

        // 4. Délégation à l'Action centrale qui gère l'insertion et la sécurité de la Base de Données
        $this->logAccountingEntryAction->execute([
            'financial_year_id' => $financialYear->id,
            'accounting_journal_id' => $mapping->accounting_journal_id,
            'date' => $date,
            'reference' => $reference,
            'description' => $description,
            'lines' => $lines,
        ]);
    }
}
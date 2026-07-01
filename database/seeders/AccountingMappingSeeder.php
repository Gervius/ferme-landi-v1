<?php

namespace Database\Seeders;

use App\Models\AccountingMapping;
use App\Models\AccountingJournal;
use App\Models\Account;
use App\Models\AnalyticalNature;
use Illuminate\Database\Seeder;

class AccountingMappingSeeder extends Seeder
{
    public function run(): void
    {
        // Récupération des journaux, comptes et natures analytiques
        $journalAchats = AccountingJournal::where('code', 'AC')->first();
        $journalVentes = AccountingJournal::where('code', 'VE')->first();
        $journalOD = AccountingJournal::where('code', 'OD')->first();

        $accountClients = Account::where('number', '4111')->first();
        $accountFournisseurs = Account::where('number', '4011')->first();
        $accountAchats = Account::where('number', '6011')->first();
        $accountVentes = Account::where('number', '7011')->first();
        $accountBanque = Account::where('number', '5211')->first();
        $accountCaisse = Account::where('number', '5711')->first();

        $natureVentes = AnalyticalNature::where('code', '06')->first();
        $natureAchats = AnalyticalNature::where('code', '04')->first();
        $naturePersonnel = AnalyticalNature::where('code', '07')->first();

        if (!$journalAchats || !$journalVentes || !$accountClients || !$accountFournisseurs || !$accountAchats || !$accountVentes) {
            $this->command->warn('Certains référentiels comptables manquent. Exécutez d\'abord AccountingReferentialSeeder.');
            return;
        }

        $mappings = [
            // Facture client
            [
                'event_type' => 'customer_invoice',
                'name' => 'Facturation client',
                'journal_code' => 'VE',
                'debit_account_number' => '4111',
                'credit_account_number' => '7011',
                'nature_code' => '06',
            ],
            // Facture fournisseur
            [
                'event_type' => 'supplier_invoice',
                'name' => 'Facture fournisseur',
                'journal_code' => 'AC',
                'debit_account_number' => '6011',
                'credit_account_number' => '4011',
                'nature_code' => '04',
            ],
            // Paiement client (encaissement)
            [
                'event_type' => 'customer_payment',
                'name' => 'Encaissement client',
                'journal_code' => 'BQ',
                'debit_account_number' => '5211',
                'credit_account_number' => '4111',
                'nature_code' => '06',
            ],
            // Paiement fournisseur (décaissement)
            [
                'event_type' => 'supplier_payment',
                'name' => 'Décaissement fournisseur',
                'journal_code' => 'BQ',
                'debit_account_number' => '4011',
                'credit_account_number' => '5211',
                'nature_code' => '04',
            ],
            // Paie
            [
                'event_type' => 'payroll',
                'name' => 'Paie du personnel',
                'journal_code' => 'OD',
                'debit_account_number' => '6611', // CORRIGÉ : N'est plus le 6011
                'credit_account_number' => '5211',
                'nature_code' => '07',
            ],
            // Don de produit
            [
                'event_type' => 'product_donation',
                'name' => 'Don de produits',
                'journal_code' => 'OD',
                'debit_account_number' => '6011', // compte de charge
                'credit_account_number' => '7011', // compte de produit (sortie de stock)
                'nature_code' => '06',
            ],
        ];

        foreach ($mappings as $map) {
            $journal = AccountingJournal::where('code', $map['journal_code'])->first();
            $debitAccount = Account::where('number', $map['debit_account_number'])->first();
            $creditAccount = Account::where('number', $map['credit_account_number'])->first();
            $nature = $map['nature_code'] ? AnalyticalNature::where('code', $map['nature_code'])->first() : null;

            if (!$journal || !$debitAccount || !$creditAccount) {
                continue;
            }

            AccountingMapping::firstOrCreate(
                ['event_type' => $map['event_type']],
                [
                    'name' => $map['name'],
                    'accounting_journal_id' => $journal->id,
                    'debit_account_id' => $debitAccount->id,
                    'credit_account_id' => $creditAccount->id,
                    'analytical_nature_id' => $nature ? $nature->id : null,
                ]
            );
        }
    }
}
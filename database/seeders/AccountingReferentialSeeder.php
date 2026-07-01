<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountingReferentialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\FinancialYear::firstOrCreate([
            'year' => 2026,
        ], [
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
            'is_closed' => false,
        ]);

        $journals = [
            ['code' => 'AC', 'name' => 'Journal des Achats'],
            ['code' => 'VE', 'name' => 'Journal des Ventes'],
            ['code' => 'CA', 'name' => 'Caisse'],
            ['code' => 'BQ', 'name' => 'Banque'],
            ['code' => 'OD', 'name' => 'Opérations Diverses'],
        ];

        foreach ($journals as $journal) {
            \App\Models\AccountingJournal::firstOrCreate(
                ['code' => $journal['code']],
                ['name' => $journal['name'], 'is_active' => true]
            );
        }

        $accounts = [
            ['number' => '4111', 'name' => 'Clients'],
            ['number' => '4011', 'name' => 'Fournisseurs'],
            ['number' => '6011', 'name' => 'Achats de matières premières'],
            // AJOUT DU COMPTE DE SALAIRES
            ['number' => '6611', 'name' => 'Charges de personnel'],
            ['number' => '7011', 'name' => 'Ventes de produits finis'],
            ['number' => '5211', 'name' => 'Banque'],
            ['number' => '5711', 'name' => 'Caisse'],
        ];

        foreach ($accounts as $account) {
            \App\Models\Account::firstOrCreate(
                ['number' => $account['number']],
                ['name' => $account['name'], 'is_active' => true]
            );
        }
    }
}

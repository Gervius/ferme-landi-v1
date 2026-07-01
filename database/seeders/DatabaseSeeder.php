<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Données de base
            CompanySeeder::class,
            UnitSeeder::class,
            CategorySeeder::class,
            SpeciesSeeder::class,
            BreedSeeder::class,
            BreedStandardSeeder::class,
            ProphylaxisProgramSeeder::class,

            // Comptabilité et analytique
            AccountingReferentialSeeder::class, // contient FinancialYear, Journals, Accounts
            AnalyticalReferentialSeeder::class, // Natures, Codes, Centers
            AccountingMappingSeeder::class,

            // Permissions et rôles
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
        ]);
    }
}
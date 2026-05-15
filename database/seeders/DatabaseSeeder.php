<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            UserSeeder::class, // Ex-AdminUserSeeder
            CompanySeeder::class, // Crée Ferme-Landi et les Sites (KI1, KI2, etc.)
            UnitSeeder::class,
            CategorySeeder::class,
            PartnerSeeder::class, // Clients & Fournisseurs
            ZootechnieSeeder::class, // Espèces, Races, Générations
        ]);
    }
}
<?php

// database/seeders/CompanySeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        
        Company::updateOrCreate(
            ['name' => 'Ferme-Landi'], // Critère de recherche
            [
                'legal_status' => 'SARL', // À adapter selon le statut réel
                'tax_id_number' => 'IFU-XXXXXXX',
                'address' => 'Bobo-Dioulasso, Burkina Faso',
                'email' => 'contact@ferme-landi.com',
                'phone' => '+226 00 00 00 00',
            ]
        );
    }
}

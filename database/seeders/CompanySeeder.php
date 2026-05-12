<?php

// database/seeders/CompanySeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Site;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        
        $company =Company::updateOrCreate(
            ['name' => 'Ferme-Landi'], 
            [
                'legal_status' => 'SARL', 
                'tax_id_number' => 'IFU-XXXXXXX',
                'address' => 'Bobo-Dioulasso, Burkina Faso',
                'email' => 'contact@ferme-landi.com',
                'phone' => '+226 00 00 00 00',
            ]
        );

        $sites = [
            [
                'company_id' => $company->id,
                'name' => 'KIRI 1 - PONDEUSE',
                'code' => 'KI1',
                'type' => 'production',
                'is_active' => true
            ],
            [
                'company_id' => $company->id,
                'name' => 'KIRI 2 - CHAIR',
                'code' => 'KI2',
                'type' => 'production',
                'is_active' => true
            ],
            [
                'company_id' => $company->id,
                'name' => 'KIRI 3 - PORC',
                'code' => 'KI3',
                'type' => 'production',
                'is_active' => true
            ],
            [
                'company_id' => $company->id,
                'name' => 'SANTI DOUGOU - PONDEUSE',
                'code' => 'ST1',
                'type' => 'production',
                'is_active' => true
            ],
        ];

        foreach ($sites as $site) {
            Site::firstOrCreate(['code' => $site['code']], $site);
        }
    }
    
}

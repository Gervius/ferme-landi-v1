<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        // Clients (Pour les Ventes)
        Customer::firstOrCreate(['phone' => '70000001'], [
            'name' => 'Supermarché Marina Market',
            'email' => 'contact@marina.bf',
            'address' => 'Centre-ville, Bobo-Dioulasso',
            'is_active' => true,
        ]);
        Customer::firstOrCreate(['phone' => '70000002'], [
            'name' => 'Boutique Alimentation Kadi',
            'address' => 'Quartier Koko, Bobo-Dioulasso',
            'is_active' => true,
        ]);

        // Fournisseurs (Pour les Achats)
        Supplier::firstOrCreate(['phone' => '75000001'], [
            'name' => 'Providendes SA (Alimentation)',
            'contact_person' => 'M. Traoré',
            'email' => 'commandes@providendes.bf',
            'address' => 'Zone Industrielle, Bobo-Dioulasso',
            'is_active' => true,
        ]);
        Supplier::firstOrCreate(['phone' => '75000002'], [
            'name' => 'Couvoir National',
            'contact_person' => 'Mme. Sanou',
            'is_active' => true,
        ]);
    }
}
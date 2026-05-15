<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\Generation;
use App\Models\Site;
use App\Models\Species;
use Illuminate\Database\Seeder;

class ZootechnieSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Espèces
        $poule = Species::firstOrCreate(['name' => 'Poule']);
        $porc = Species::firstOrCreate(['name' => 'Porc']);

        // 2. Races
        $isaBrown = Breed::firstOrCreate(['name' => 'Isa Brown (Pondeuse)', 'species_id' => $poule->id]);
        $largeWhite = Breed::firstOrCreate(['name' => 'Large White', 'species_id' => $porc->id]);

        // On récupère les sites
        $siteKiri1 = Site::where('code', 'KI1')->first(); // Pondeuses
        $siteKiri3 = Site::where('code', 'KI3')->first(); // Porcs

        if ($siteKiri1 && $siteKiri3) {
            // 3. Générations (CORRIGÉ AVEC LES BONS PREFIXES PP et PO)
            Generation::firstOrCreate(['code' => 'PP-2026-01-001'], [
                'site_id' => $siteKiri1->id,
                'breed_id' => $isaBrown->id,
                'type' => 'pondeuse',
                'start_date' => '2026-01-15',
                'initial_quantity' => 5000,
                'current_quantity' => 4850,
                'status' => 'actif',
            ]);

            Generation::firstOrCreate(['code' => 'PO-2026-02-001'], [
                'site_id' => $siteKiri3->id,
                'breed_id' => $largeWhite->id,
                'type' => 'porc',
                'start_date' => '2026-02-01',
                'initial_quantity' => 50,
                'current_quantity' => 50,
                'status' => 'actif',
            ]);
        }
    }
}
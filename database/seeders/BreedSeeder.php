<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\Species;
use Illuminate\Database\Seeder;

class BreedSeeder extends Seeder
{
    public function run(): void
    {
        $speciesMap = Species::pluck('id', 'name')->toArray();

        $breeds = [
            ['species_name' => 'Poulet pondeuse', 'name' => 'Lohmann Brown'],
            ['species_name' => 'Poulet pondeuse', 'name' => 'Isa Brown'],
            ['species_name' => 'Poulet de chair', 'name' => 'Cobb 500'],
            ['species_name' => 'Poulet de chair', 'name' => 'Ross 308'],
            ['species_name' => 'Porc', 'name' => 'Duroc'],
            ['species_name' => 'Porc', 'name' => 'Large White'],
        ];

        foreach ($breeds as $b) {
            $speciesId = $speciesMap[$b['species_name']] ?? null;
            if ($speciesId) {
                Breed::firstOrCreate(
                    ['name' => $b['name'], 'species_id' => $speciesId],
                    ['name' => $b['name'], 'species_id' => $speciesId, 'is_active' => true]
                );
            }
        }
    }
}
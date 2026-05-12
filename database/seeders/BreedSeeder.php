<?php

namespace Database\Seeders;

use App\Models\Species;
use App\Models\Breed;
use Illuminate\Database\Seeder;

class BreedSeeder extends Seeder
{
    public function run(): void
    {
        
        $poultry = Species::firstOrCreate(['name' => 'Volaille'], ['is_active' => true]);

        
        $breeds = [
            ['name' => 'Lohmann Brown (Pondeuse)', 'is_active' => true],
            ['name' => 'Isa Brown (Pondeuse)', 'is_active' => true],
            ['name' => 'Cobb 500 (Chair)', 'is_active' => true],
        ];

        foreach ($breeds as $breed) {
            Breed::firstOrCreate([
                'name' => $breed['name'],
                'species_id' => $poultry->id
            ], $breed);
        }
    }
}
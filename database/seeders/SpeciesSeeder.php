<?php

namespace Database\Seeders;

use App\Models\Species;
use Illuminate\Database\Seeder;

class SpeciesSeeder extends Seeder
{
    public function run(): void
    {
        $species = [
            ['name' => 'Poulet pondeuse'],
            ['name' => 'Poulet de chair'],
            ['name' => 'Porc'],
        ];

        foreach ($species as $s) {
            Species::firstOrCreate(['name' => $s['name']], $s);
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\Breed;
use App\Models\BreedStandard;
use Illuminate\Database\Seeder;

class BreedStandardSeeder extends Seeder
{
    public function run(): void
    {
        $breeds = Breed::with('species')->get();

        foreach ($breeds as $breed) {
            $data = $this->getStandardData($breed->name, $breed->species->name);
            if ($data) {
                BreedStandard::firstOrCreate(
                    ['breed_id' => $breed->id],
                    $data
                );
            }
        }
    }

    private function getStandardData(string $breedName, string $speciesName): ?array
    {
        // Valeurs par défaut selon espèce/race
        $defaults = [
            'Poulet pondeuse' => [
                'target_laying_start_age' => 18,
                'target_culling_age' => 72,
                'peak_laying_rate' => 95,
                'target_daily_feed_intake' => 115, // en grammes
            ],
            'Poulet de chair' => [
                'target_laying_start_age' => 0, // non applicable
                'target_culling_age' => 6, // en semaines
                'peak_laying_rate' => 0,
                'target_daily_feed_intake' => 150,
            ],
            'Porc' => [
                'target_laying_start_age' => 0,
                'target_culling_age' => 24, // mois
                'peak_laying_rate' => 0,
                'target_daily_feed_intake' => 2500, // grammes
            ],
        ];

        $base = $defaults[$speciesName] ?? null;
        if (!$base) return null;

        // Ajustements spécifiques par race si besoin
        if ($breedName === 'Lohmann Brown') {
            $base['peak_laying_rate'] = 96;
        } elseif ($breedName === 'Cobb 500') {
            $base['target_culling_age'] = 7;
            $base['target_daily_feed_intake'] = 160;
        }

        return $base;
    }
}
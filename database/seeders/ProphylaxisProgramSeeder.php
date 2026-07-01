<?php

namespace Database\Seeders;

use App\Models\ProphylaxisProgram;
use App\Models\ProphylaxisStep;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProphylaxisProgramSeeder extends Seeder
{
    public function run(): void
    {
        // Récupération des catégories de médicaments
        $vaccinsCat = Category::where('slug', 'vaccins')->first();
        $antibioCat = Category::where('slug', 'antibiotiques')->first();
        $vermifugesCat = Category::where('slug', 'vermifuges')->first();

        if (!$vaccinsCat || !$antibioCat || !$vermifugesCat) {
            $this->command->warn('Catégories de médicaments non trouvées. Exécutez d\'abord CategorySeeder.');
            return;
        }

        $programs = [
            [
                'name' => 'Vaccination Poulets de Chair',
                'animal_type' => 'chair',
                'steps' => [
                    ['day_offset' => 0, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Vaccin Marek'],
                    ['day_offset' => 7, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Vaccin Newcastle + Gumboro'],
                    ['day_offset' => 14, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Rappel Gumboro'],
                    ['day_offset' => 21, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Vaccin variole'],
                ]
            ],
            [
                'name' => 'Vaccination Pondeuses',
                'animal_type' => 'pondeuse',
                'steps' => [
                    ['day_offset' => 0, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Marek'],
                    ['day_offset' => 7, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Newcastle + Gumboro'],
                    ['day_offset' => 14, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Rappel Gumboro'],
                    ['day_offset' => 21, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Variole'],
                    ['day_offset' => 28, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Newcastle (rappel)'],
                    ['day_offset' => 56, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Rappel Newcastle + Gumboro'],
                    ['day_offset' => 90, 'medication_category_id' => $vaccinsCat->id, 'description' => 'Rappel variole'],
                    ['day_offset' => 120, 'medication_category_id' => $antibioCat->id, 'description' => 'Traitement antibiotique préventif (si besoin)'],
                ]
            ],
            [
                'name' => 'Déparasitage Porcs',
                'animal_type' => 'porc',
                'steps' => [
                    ['day_offset' => 30, 'medication_category_id' => $vermifugesCat->id, 'description' => 'Vermifuge large spectre'],
                    ['day_offset' => 60, 'medication_category_id' => $vermifugesCat->id, 'description' => 'Rappel vermifuge'],
                    ['day_offset' => 90, 'medication_category_id' => $vermifugesCat->id, 'description' => 'Vermifuge avec changement de molécule'],
                ]
            ],
        ];

        foreach ($programs as $progData) {
            $program = ProphylaxisProgram::firstOrCreate(
                ['name' => $progData['name']],
                ['animal_type' => $progData['animal_type'], 'is_active' => true]
            );

            // Création des étapes
            foreach ($progData['steps'] as $stepData) {
                ProphylaxisStep::firstOrCreate(
                    [
                        'prophylaxis_program_id' => $program->id,
                        'day_offset' => $stepData['day_offset'],
                    ],
                    [
                        'medication_category_id' => $stepData['medication_category_id'],
                        'description' => $stepData['description'],
                        'alert_days_before' => 1,
                    ]
                );
            }
        }
    }
}
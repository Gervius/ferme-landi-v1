<?php

namespace Database\Seeders;

use App\Models\AnalyticalCode;
use App\Models\AnalyticalNature;
use App\Models\AnalyticalCenter;
use Illuminate\Database\Seeder;

class AnalyticalReferentialSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Natures analytiques
        $natures = [
            '01' => ['code' => '01', 'name' => 'FONCTIONNEMENT'],
            '04' => ['code' => '04', 'name' => 'ACHATS MATIERES (Aliment, etc.)'],
            '05' => ['code' => '05', 'name' => 'PRODUITS VETERINAIRES'],
            '06' => ['code' => '06', 'name' => 'VENTES OU RECETTES'],
            '07' => ['code' => '07', 'name' => 'FRAIS DE PERSONNEL (Salaires)'],
        ];

        $insertedNatures = [];
        foreach ($natures as $key => $n) {
            $insertedNatures[$key] = AnalyticalNature::firstOrCreate(['code' => $n['code']], $n);
        }

        // 2. Codes analytiques
        $codes = [
            '0001' => ['code' => '0001', 'short_name' => 'ADMIN GEN', 'name' => 'ADMINISTRATION GENERALE'],
            '0003' => ['code' => '0003', 'short_name' => 'PONDEUSES', 'name' => 'POULES PONDEUSES'],
            '0004' => ['code' => '0004', 'short_name' => 'POULET CHAIR', 'name' => 'POULETS DE CHAIR'],
            '0005' => ['code' => '0005', 'short_name' => 'PORCHERIE', 'name' => 'PORCHERIE'],
        ];

        $insertedCodes = [];
        foreach ($codes as $key => $c) {
            $insertedCodes[$key] = AnalyticalCode::firstOrCreate(['code' => $c['code']], $c);
        }

        // 3. Maillage des centres d'activité
        $centers = [
            // Flux de Ventes
            [
                'nature_code' => '06', 'code_code' => '0003',
                'short_name' => 'Vte Œufs', 'name' => 'Vente d\'œufs (Pondeuses)'
            ],
            [
                'nature_code' => '06', 'code_code' => '0004',
                'short_name' => 'Vte Poulets', 'name' => 'Vente de Poulets de Chair'
            ],
            [
                'nature_code' => '06', 'code_code' => '0005',
                'short_name' => 'Vte Porcs', 'name' => 'Vente de Porcs Charcutiers'
            ],
            // Flux d'Achats / Exploitation
            [
                'nature_code' => '04', 'code_code' => '0003',
                'short_name' => 'Aliment Pondeuses', 'name' => 'Consommation Aliment Pondeuses'
            ],
            [
                'nature_code' => '05', 'code_code' => '0003',
                'short_name' => 'Santé Pondeuses', 'name' => 'Produits Vétérinaires Pondeuses'
            ],
            // Flux de Personnel (RH)
            [
                'nature_code' => '07', 'code_code' => '0001',
                'short_name' => 'Salaires Admin', 'name' => 'Salaires Administration'
            ],
            [
                'nature_code' => '07', 'code_code' => '0003',
                'short_name' => 'Salaires Pondeuses', 'name' => 'Salaires Équipe Pondeuses'
            ],
        ];

        foreach ($centers as $ctrl) {
            $natureId = $insertedNatures[$ctrl['nature_code']]->id;
            $codeId = $insertedCodes[$ctrl['code_code']]->id;

            AnalyticalCenter::firstOrCreate(
                [
                    'analytical_nature_id' => $natureId,
                    'analytical_code_id' => $codeId
                ],
                [
                    'short_name' => $ctrl['short_name'],
                    'name' => $ctrl['name'],
                    'is_active' => true
                ]
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Unités de base
        $uniteBase = Unit::firstOrCreate(['symbol' => 'un'], [
            'name' => 'Unité (Oeuf)',
            'type' => 'quantite',
            'is_base_unit' => true,
            'conversion_rate' => 1.000000,
        ]);

        $kgBase = Unit::firstOrCreate(['symbol' => 'kg'], [
            'name' => 'Kilogramme',
            'type' => 'poids',
            'is_base_unit' => true,
            'conversion_rate' => 1.000000,
        ]);

        $litreBase = Unit::firstOrCreate(['symbol' => 'L'], [
            'name' => 'Litre',
            'type' => 'volume',
            'is_base_unit' => true,
            'conversion_rate' => 1.000000,
        ]);

        // 2. Unités dérivées (avec base_unit_id et taux de conversion)
        Unit::firstOrCreate(['symbol' => 'pl30'], [
            'name' => 'Plateau de 30',
            'type' => 'quantite',
            'is_base_unit' => false,
            'base_unit_id' => $uniteBase->id,
            'conversion_rate' => 30.000000,
        ]);

        Unit::firstOrCreate(['symbol' => 'sac50'], [
            'name' => 'Sac de 50 Kg',
            'type' => 'poids',
            'is_base_unit' => false,
            'base_unit_id' => $kgBase->id,
            'conversion_rate' => 50.000000,
        ]);
    }
}
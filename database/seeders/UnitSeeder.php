<?php

namespace Database\Seeders;

use App\Models\Unit;
use App\Enums\UnitType;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        // Unités de base
        $units = [
            // Masse
            ['name' => 'Kilogramme', 'symbol' => 'kg', 'type' => UnitType::MASSE->value, 'is_base_unit' => true],
            ['name' => 'Gramme', 'symbol' => 'g', 'type' => UnitType::MASSE->value, 'is_base_unit' => false, 'base_unit_id' => null, 'conversion_rate' => 0.001],
            ['name' => 'Tonne', 'symbol' => 't', 'type' => UnitType::MASSE->value, 'is_base_unit' => false, 'base_unit_id' => null, 'conversion_rate' => 1000],
            // Volume
            ['name' => 'Litre', 'symbol' => 'L', 'type' => UnitType::VOLUME->value, 'is_base_unit' => true],
            ['name' => 'Millilitre', 'symbol' => 'mL', 'type' => UnitType::VOLUME->value, 'is_base_unit' => false, 'base_unit_id' => null, 'conversion_rate' => 0.001],
            // Unitaire
            ['name' => 'Pièce', 'symbol' => 'pc', 'type' => UnitType::UNITAIRE->value, 'is_base_unit' => true],
            ['name' => 'Douzaine', 'symbol' => 'dz', 'type' => UnitType::UNITAIRE->value, 'is_base_unit' => false, 'base_unit_id' => null, 'conversion_rate' => 12],
            ['name' => 'Plateau 30 œufs', 'symbol' => 'plt', 'type' => UnitType::CONDITIONNEMENT->value, 'is_base_unit' => false, 'base_unit_id' => null, 'conversion_rate' => 30],
            // Conditionnement
            ['name' => 'Sac 50 kg', 'symbol' => 'sac', 'type' => UnitType::CONDITIONNEMENT->value, 'is_base_unit' => false, 'base_unit_id' => null, 'conversion_rate' => 50],
            ['name' => 'Carton 12 pièces', 'symbol' => 'carton', 'type' => UnitType::CONDITIONNEMENT->value, 'is_base_unit' => false, 'base_unit_id' => null, 'conversion_rate' => 12],
        ];

        foreach ($units as $unitData) {
            Unit::firstOrCreate(
                ['symbol' => $unitData['symbol']],
                $unitData
            );
        }

        // Mise à jour des clés étrangères après insertion
        $kg = Unit::where('symbol', 'kg')->first();
        $g = Unit::where('symbol', 'g')->first();
        $t = Unit::where('symbol', 't')->first();
        $L = Unit::where('symbol', 'L')->first();
        $mL = Unit::where('symbol', 'mL')->first();
        $pc = Unit::where('symbol', 'pc')->first();
        $dz = Unit::where('symbol', 'dz')->first();
        $plt = Unit::where('symbol', 'plt')->first();
        $sac = Unit::where('symbol', 'sac')->first();
        $carton = Unit::where('symbol', 'carton')->first();

        // Assigner les base_unit_id
        if ($g) { $g->update(['base_unit_id' => $kg->id]); }
        if ($t) { $t->update(['base_unit_id' => $kg->id]); }
        if ($mL) { $mL->update(['base_unit_id' => $L->id]); }
        if ($dz) { $dz->update(['base_unit_id' => $pc->id]); }
        if ($plt) { $plt->update(['base_unit_id' => $pc->id]); }
        if ($sac) { $sac->update(['base_unit_id' => $kg->id]); }
        if ($carton) { $carton->update(['base_unit_id' => $pc->id]); }
    }
}
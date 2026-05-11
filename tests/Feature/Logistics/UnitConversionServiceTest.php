<?php

namespace Tests\Feature\Logistics;

use App\Models\Unit;
use App\Services\Logistics\UnitConversionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnitConversionServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_converts_from_derived_to_base_unit(): void
    {
        $baseUnit = Unit::factory()->create([
            'is_base_unit' => true,
            'conversion_rate' => 1.0,
            'base_unit_id' => null,
        ]);

        $derivedUnit = Unit::factory()->create([
            'is_base_unit' => false,
            'base_unit_id' => $baseUnit->id,
            'conversion_rate' => 30.0,
        ]);

        $service = new UnitConversionService;

        // 2 Plateaux of 30 should be 60 base units
        $result = $service->toBase(2, $derivedUnit);

        $this->assertEquals(60.0, $result);
    }

    public function test_it_converts_from_base_to_derived_unit(): void
    {
        $baseUnit = Unit::factory()->create([
            'is_base_unit' => true,
            'conversion_rate' => 1.0,
            'base_unit_id' => null,
        ]);

        $derivedUnit = Unit::factory()->create([
            'is_base_unit' => false,
            'base_unit_id' => $baseUnit->id,
            'conversion_rate' => 30.0,
        ]);

        $service = new UnitConversionService;

        // 60 base units should be 2 Plateaux of 30
        $result = $service->fromBase(60, $derivedUnit);

        $this->assertEquals(2.0, $result);
    }
}

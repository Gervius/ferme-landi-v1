<?php

namespace App\Services\Logistics;

use App\Models\Unit;

/**
 * Service verrouillé en final readonly pour optimisation RAM (stateless).
 */
final readonly class UnitConversionService
{
    /**
     * Convert a given value from the provided unit to its base unit.
     */
    public function toBase(float $value, Unit $unit): float
    {
        if ($unit->is_base_unit || ! $unit->base_unit_id) {
            return $value;
        }

        return $value * (float) $unit->conversion_rate;
    }

    /**
     * Convert a given value from the base unit to the provided unit.
     */
    public function fromBase(float $value, Unit $unit): float
    {
        if ($unit->is_base_unit || ! $unit->base_unit_id) {
            return $value;
        }

        $conversionRate = (float) $unit->conversion_rate;

        if ($conversionRate === 0.0) {
            throw new \InvalidArgumentException("Conversion rate cannot be zero for unit {$unit->symbol}.");
        }

        return $value / $conversionRate;
    }
}
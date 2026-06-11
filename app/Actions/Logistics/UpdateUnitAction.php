<?php

namespace App\Actions\Logistics;

use App\Models\Unit;

final readonly class UpdateUnitAction
{
    /**
     * Update an existing unit.
     */
    public function execute(Unit $unit, array $data): Unit
    {
        if (isset($data['is_base_unit']) && $data['is_base_unit']) {
            $data['base_unit_id'] = null;
            $data['conversion_rate'] = 1.0;
        }

        $unit->update($data);

        return $unit;
    }
}
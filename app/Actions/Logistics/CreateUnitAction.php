<?php

namespace App\Actions\Logistics;

use App\Models\Unit;

final readonly class CreateUnitAction
{
    /**
     * Create a new unit.
     */
    public function execute(array $data): Unit
    {
        if (isset($data['is_base_unit']) && $data['is_base_unit']) {
            $data['base_unit_id'] = null;
            $data['conversion_rate'] = 1.0;
        }

        return Unit::create($data);
    }
}
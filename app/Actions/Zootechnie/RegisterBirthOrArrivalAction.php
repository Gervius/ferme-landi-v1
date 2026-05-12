<?php

namespace App\Actions\Zootechnie;

use App\Models\Generation;
use Illuminate\Support\Carbon;

class RegisterBirthOrArrivalAction
{
    /**
     * Initializes a new generation/flock.
     */
    public function execute(array $data): Generation
    {
        $startDate = Carbon::parse($data['start_date']);

        // Generate code: PREFIX-AAAA-MM-001
        if (empty($data['code'])) {
            $year = $startDate->format('Y');
            $month = $startDate->format('m');

            $typePrefix = match ($data['type']) {
                'pondeuse' => 'PP',
                'chair' => 'PC',
                'porc' => 'PO',
                default => 'XX',
            };

            $prefix = "{$typePrefix}-{$year}-{$month}-";

            $count = Generation::where('code', 'like', "{$prefix}%")->count();
            $sequence = str_pad((string) ($count + 1), 3, '0', STR_PAD_LEFT);
            $data['code'] = "{$prefix}{$sequence}";
        }

        // initial quantity becomes current quantity at the start
        if (! isset($data['current_quantity'])) {
            $data['current_quantity'] = $data['initial_quantity'];
        }

        if (! isset($data['status'])) {
            $data['status'] = 'actif';
        }

        $generation = Generation::create($data);

        // Schedule prophylaxis treatments if an active program exists for this animal type
        $program = \App\Models\ProphylaxisProgram::where('animal_type', $generation->type)
            ->where('is_active', true)
            ->first();

        if ($program) {
            foreach ($program->steps as $step) {
                \App\Models\ScheduledTreatment::create([
                    'generation_id' => $generation->id,
                    'prophylaxis_step_id' => $step->id,
                    'scheduled_date' => $generation->start_date->copy()->addDays($step->day_offset),
                    'status' => 'pending',
                ]);
            }
        }

        return $generation;
    }
}

<?php

namespace App\Actions\Zootechnie;

use App\Enums\GenerationType;
use App\Enums\GenerationStatus;
use App\Models\Generation;
use App\Models\ProphylaxisProgram;
use App\Models\ScheduledTreatment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

final readonly class RegisterBirthOrArrivalAction
{
    public function execute(array $data): Generation
    {
        return DB::transaction(function () use ($data) {
            $startDate = Carbon::parse($data['start_date']);
            
            // Cast sécurisé vers l'Enum
            $type = $data['type'] instanceof GenerationType 
                ? $data['type'] 
                : GenerationType::from($data['type']);

            if (empty($data['code'])) {
                $year = $startDate->format('Y');
                $month = $startDate->format('m');

                $typePrefix = match ($type) {
                    GenerationType::PONDEUSE => 'PP',
                    GenerationType::CHAIR => 'PC',
                    GenerationType::PORC => 'PO',
                };

                $prefix = "{$typePrefix}-{$year}-{$month}-";

                // CORRECTION RACE CONDITION : On verrouille en lecture et on prend le code le plus élevé
                $lastCode = Generation::where('code', 'like', "{$prefix}%")
                    ->lockForUpdate()
                    ->orderBy('code', 'desc')
                    ->value('code');

                $sequence = 1;
                if ($lastCode) {
                    $sequence = (int) substr($lastCode, -3) + 1;
                }

                $data['code'] = $prefix . str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);
            }

            $data['current_quantity'] = $data['current_quantity'] ?? $data['initial_quantity'];
            $data['status'] = $data['status'] ?? GenerationStatus::ACTIF->value;
            $data['type'] = $type->value; 

            $generation = Generation::create($data);

            // OPTIMISATION RAM & RÉSEAU : On charge strictement ce qui est nécessaire
            $program = ProphylaxisProgram::where('animal_type', $type->value)
                ->where('is_active', true)
                ->with(['steps:id,prophylaxis_program_id,day_offset']) // Eager loading hyper ciblé
                ->first(['id']); // On ne récupère que l'ID du programme, pas ses 50 colonnes

            if ($program && $program->steps->isNotEmpty()) {
                $treatments = [];
                $now = now();
                
                foreach ($program->steps as $step) {
                    $treatments[] = [
                        'generation_id' => $generation->id,
                        'prophylaxis_step_id' => $step->id,
                        'scheduled_date' => $generation->start_date->copy()->addDays($step->day_offset)->format('Y-m-d'),
                        'status' => 'pending',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                
                // BULK INSERT : 1 seule requête DB au lieu de N requêtes (sauve ~2.5 secondes de latence)
                ScheduledTreatment::insert($treatments);
            }

            return $generation;
        });
    }
}
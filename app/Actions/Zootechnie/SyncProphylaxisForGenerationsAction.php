<?php

namespace App\Actions\Zootechnie;

use App\Enums\GenerationStatus;
use App\Models\Generation;
use App\Models\ProphylaxisProgram;
use App\Models\ScheduledTreatment;
use Illuminate\Support\Facades\DB;

final readonly class SyncProphylaxisForGenerationsAction
{
    /**
     * 🚀 REFACTORING EXTRÊME POUR LATENCE 179ms : 
     * Passage d'une logique N+1 (O(N*M) requêtes) à une logique Bulk Upsert (2 requêtes).
     */
    public function execute(ProphylaxisProgram $program): void
    {
        if (!$program->is_active) {
            return;
        }

        DB::transaction(function () use ($program) {
            // 1. Charger uniquement les ID et dates (sauvegarde de la RAM)
            $generations = Generation::where('type', $program->animal_type)
                ->where('status', GenerationStatus::ACTIF->value)
                ->select('id', 'start_date') 
                ->lockForUpdate()
                ->get();

            if ($generations->isEmpty()) {
                return;
            }

            $program->load('steps:id,prophylaxis_program_id,day_offset');

            $upserts = [];
            $now = now();

            // 2. Préparation en mémoire RAM (Zéro requête DB ici)
            foreach ($generations as $generation) {
                foreach ($program->steps as $step) {
                    $upserts[] = [
                        'generation_id' => $generation->id,
                        'prophylaxis_step_id' => $step->id,
                        'scheduled_date' => $generation->start_date->copy()->addDays($step->day_offset)->format('Y-m-d'),
                        'status' => 'pending',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            // 3. Exécution massive en UNE SEULE REQUÊTE via UPSERT
            // Si la clé (generation_id, prophylaxis_step_id) existe, on met à jour la date.
            // Note: Nécessite la contrainte Unique ajoutée précédemment dans la migration !
            if (!empty($upserts)) {
                ScheduledTreatment::upsert(
                    $upserts,
                    ['generation_id', 'prophylaxis_step_id'], // Unique keys
                    ['scheduled_date', 'updated_at']          // Columns to update if exists
                );
            }
        });
    }
}
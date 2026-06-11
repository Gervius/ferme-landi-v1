<?php

namespace App\Actions\Zootechnie;

use App\Models\Generation;
use App\Models\ProphylaxisProgram;
use App\Models\ScheduledTreatment;

class SyncProphylaxisForGenerationsAction
{
    /**
     * Applique ou met à jour le programme de prophylaxie sur toutes les générations actives correspondantes.
     */
    public function execute(ProphylaxisProgram $program): void
    {
        // 1. Si le programme est inactif, on ne planifie rien de nouveau
        if (!$program->is_active) {
            return;
        }

        // 2. On récupère toutes les générations ACTIVES du bon type d'animal
        $generations = Generation::where('type', $program->animal_type)
            ->where('status', 'actif')
            ->get();

        // 3. On recharge les étapes pour avoir la dernière version en base
        $program->load('steps');

        foreach ($generations as $generation) {
            foreach ($program->steps as $step) {
                // 4. On cherche si un traitement existe déjà pour ce lot ET cette étape
                $treatment = ScheduledTreatment::firstOrNew([
                    'generation_id' => $generation->id,
                    'prophylaxis_step_id' => $step->id,
                ]);

                // 5. Mise à jour Intelligente : On modifie la date SEULEMENT si c'est nouveau ou "en attente"
                // On ne touche surtout pas aux traitements déjà "completed" (terminés) !
                if (!$treatment->exists || $treatment->status === 'pending') {
                    $treatment->scheduled_date = $generation->start_date->copy()->addDays($step->day_offset);
                    
                    if (!$treatment->exists) {
                        $treatment->status = 'pending'; // Statut par défaut à la création
                    }
                    
                    $treatment->save();
                }
            }
        }
    }
}
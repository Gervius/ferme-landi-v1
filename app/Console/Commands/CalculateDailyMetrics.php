<?php

namespace App\Console\Commands;

use App\Models\DailyFlockMetric;
use App\Models\DailyProduction;
use App\Models\FeedConsumption;
use App\Models\FlockMortality;
use App\Models\Generation;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class CalculateDailyMetrics extends Command
{
    protected $signature = 'app:calculate-daily-metrics {--date= : The date (Y-m-d).}';
    protected $description = 'Calculates daily metrics with zero N+1 latency.';

    public function handle()
    {
        $dateString = $this->option('date');
        $date = $dateString ? Carbon::parse($dateString)->format('Y-m-d') : Carbon::now()->format('Y-m-d');

        // 1. On récupère TOUTES les générations actives en une fois avec le strict minimum
        $generations = Generation::where('status', 'actif')->get(['id', 'current_quantity']);

        if ($generations->isEmpty()) {
            $this->info("Aucune génération active à traiter.");
            return;
        }

        $generationIds = $generations->pluck('id')->toArray();

        // 2. AGRÉGATION SQL DE MASSE (4 requêtes au lieu de 400)
        $eggsProduced = DailyProduction::whereIn('generation_id', $generationIds)
            ->where('date', $date)
            ->where('status', 'approved')
            ->groupBy('generation_id')
            ->selectRaw('generation_id, SUM(total_base_quantity) as total')
            ->pluck('total', 'generation_id');

        $feedConsumed = FeedConsumption::whereIn('generation_id', $generationIds)
            ->where('date', $date)
            ->where('status', 'approved')
            ->groupBy('generation_id')
            ->selectRaw('generation_id, SUM(total_base_quantity) as total')
            ->pluck('total', 'generation_id');

        $mortalities = FlockMortality::whereIn('generation_id', $generationIds)
            ->where('date', $date)
            ->where('status', 'approved')
            ->groupBy('generation_id')
            ->selectRaw('generation_id, SUM(quantity) as total')
            ->pluck('total', 'generation_id');

        // 3. PRÉPARATION DU UPSERT DE MASSE EN RAM
        $upsertData = [];

        foreach ($generations as $gen) {
            $eggs = $eggsProduced[$gen->id] ?? 0;
            $feed = $feedConsumed[$gen->id] ?? 0;
            $mortality = $mortalities[$gen->id] ?? 0;
            $live = $gen->current_quantity;

            $layingRate = $live > 0 ? round(($eggs / $live) * 100, 2) : 0;
            $fcr = $eggs > 0 ? round($feed / $eggs, 2) : 0;

            $upsertData[] = [
                'generation_id' => $gen->id,
                'date' => $date,
                'live_quantity' => $live,
                'eggs_produced' => $eggs,
                'feed_consumed' => $feed,
                'mortality_count' => $mortality,
                'laying_rate' => $layingRate,
                'feed_conversion_ratio' => $fcr,
                // Astuce : La moyenne de poids devrait aussi être extraite via une sous-requête groupée pour être parfaite.
                'average_weight' => null, 
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // 4. INSERTION / MISE À JOUR EN 1 SEULE REQUÊTE !
        DailyFlockMetric::upsert(
            $upsertData,
            ['generation_id', 'date'], // Clés uniques (Ajoute un index unique sur ces 2 colonnes dans ta migration !)
            ['live_quantity', 'eggs_produced', 'feed_consumed', 'mortality_count', 'laying_rate', 'feed_conversion_ratio', 'updated_at']
        );

        $this->info("Métriques calculées en bulk pour " . count($generations) . " lots sur {$date}.");
    }
}
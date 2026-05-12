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
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:calculate-daily-metrics {--date= : The date to calculate metrics for (Y-m-d). Defaults to today.}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculates daily metrics (eggs, feed, mortality, FCR, laying rate) for all active generations.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dateString = $this->option('date');
        $date = $dateString ? Carbon::parse($dateString)->startOfDay() : Carbon::now()->startOfDay();

        $activeGenerations = Generation::where('status', 'actif')->get();

        $processedCount = 0;

        foreach ($activeGenerations as $generation) {
            // Eggs produced
            $eggsProduced = DailyProduction::where('generation_id', $generation->id)
                ->where('date', $date->format('Y-m-d'))
                ->approved()
                ->sum('total_base_quantity');

            // Feed consumed
            $feedConsumed = FeedConsumption::where('generation_id', $generation->id)
                ->where('date', $date->format('Y-m-d'))
                ->approved()
                ->sum('total_base_quantity');

            // Mortality
            $mortalityCount = FlockMortality::where('generation_id', $generation->id)
                ->where('date', $date->format('Y-m-d'))
                ->approved()
                ->sum('quantity');

            // Live quantity is current_quantity (assuming it's updated throughout the day)
            // or we could calculate it based on initial minus historical mortality.
            // The prompt says "live_quantity: Nombre de sujets vivants à cette date".
            // If the mortalities of the day have already been deducted from current_quantity upon approval,
            // we just use current_quantity. Let's use current_quantity.
            $liveQuantity = $generation->current_quantity;

            // Laying rate: (Eggs / Live Quantity) * 100
            $layingRate = 0;
            if ($liveQuantity > 0) {
                $layingRate = ($eggsProduced / $liveQuantity) * 100;
            }

            // Feed Conversion Ratio (FCR): Feed / Eggs
            $fcr = 0;
            if ($eggsProduced > 0) {
                $fcr = $feedConsumed / $eggsProduced;
            }

            // Upsert the metric
            DailyFlockMetric::updateOrCreate(
                [
                    'generation_id' => $generation->id,
                    'date' => $date->format('Y-m-d'),
                ],
                [
                    'live_quantity' => $liveQuantity,
                    'eggs_produced' => $eggsProduced,
                    'feed_consumed' => $feedConsumed,
                    'mortality_count' => $mortalityCount,
                    'laying_rate' => $layingRate,
                    'feed_conversion_ratio' => $fcr,
                ]
            );

            $processedCount++;
        }

        $this->info("Processed daily metrics for {$processedCount} generations on {$date->format('Y-m-d')}.");
    }
}

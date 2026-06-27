<?php

namespace App\Http\Controllers\Zootechnie;

use App\Http\Controllers\Controller;
use App\Models\Generation;
use Illuminate\Http\JsonResponse;

// Ajout de 'final' pour bloquer l'héritage
final class ZootechnieStatsController extends Controller
{
    /**
     * Retrieve daily flock metrics for a specific generation.
     */
    public function getMetrics(Generation $generation): JsonResponse
    {
        // Gate::authorize('view', $generation);

        // OPTIMISATION RAM : select() explicite pour l'API
        $metrics = $generation->dailyFlockMetrics()
            ->select([
                'id', 'generation_id', 'date', 'live_quantity', 'eggs_produced', 
                'feed_consumed', 'mortality_count', 'laying_rate', 
                'feed_conversion_ratio', 'average_weight'
            ])
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'data' => $metrics,
        ]);
    }
}
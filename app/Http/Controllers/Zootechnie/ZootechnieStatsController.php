<?php

namespace App\Http\Controllers\Zootechnie;

use App\Http\Controllers\Controller;
use App\Models\Generation;
use Illuminate\Http\JsonResponse;

class ZootechnieStatsController extends Controller
{
    /**
     * Retrieve daily flock metrics for a specific generation.
     */
    public function getMetrics(Generation $generation): JsonResponse
    {
        // Assuming user needs 'view generations' permission to see stats
        // Gate::authorize('view', $generation);

        $metrics = $generation->dailyFlockMetrics()
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'data' => $metrics,
        ]);
    }
}

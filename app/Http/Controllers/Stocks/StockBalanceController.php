<?php

namespace App\Http\Controllers\Stocks;

use App\Http\Controllers\Controller;
use App\Models\StockBalance;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class StockBalanceController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', StockBalance::class);

        $stockBalances = StockBalance::with(['site', 'category', 'unit'])->get();

        return Inertia::render('Stocks/StockBalances/Index', [
            'stockBalances' => $stockBalances,
        ]);
    }
}

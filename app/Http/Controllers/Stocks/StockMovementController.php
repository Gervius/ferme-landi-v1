<?php

namespace App\Http\Controllers\Stocks;

use App\Actions\Stocks\LogStockMovementAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Stocks\StoreStockMovementRequest;
use App\Models\Category;
use App\Models\Site;
use App\Models\StockMovement;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{


    public function index(): Response
    {
        Gate::authorize('viewAny', StockMovement::class);

        $stockMovements = StockMovement::with(['site', 'category', 'unit', 'creator'])
            ->orderByDesc('date')
            ->paginate(15); // <-- CORRECTION ICI

        

        return Inertia::render('Stocks/StockMovements/Index', [
            'stockMovements' => $stockMovements,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', StockMovement::class);

        $sites = Site::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);


        return Inertia::render('Stocks/StockMovements/Create', [
            'sites' => $sites,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function store(StoreStockMovementRequest $request, LogStockMovementAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('stockMovementsIndex')
            ->with('success', 'Mouvement de stock enregistré avec succès.');
    }
}

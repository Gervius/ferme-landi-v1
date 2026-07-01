<?php

namespace App\Http\Controllers\Stocks;

use App\Actions\Stocks\LogStockMovementAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Stocks\StoreStockMovementRequest;
use App\Models\Item;
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

        // Optimisation RAM : on ne charge que les colonnes strictement nécessaires
        $stockMovements = StockMovement::with([
            'site:id,name', 
            'item:id,name', 
            'unit:id,name,symbol', 
            'creator:id,name'
        ])
            ->orderByDesc('date')
            ->paginate(15);

        // Reflète ton arborescence de dossiers
        return Inertia::render('Stocks/StockMovements/Index', [
            'stockMovements' => $stockMovements,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', StockMovement::class);

        $sites = Site::select('id', 'name')->get();
        $items = Item::where('is_active', true)->select('id', 'name', 'default_unit_id')->get();
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Stocks/StockMovements/Create', [
            'sites' => $sites,
            'items' => $items,
            'units' => $units,
        ]);
    }

    public function store(StoreStockMovementRequest $request, LogStockMovementAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect('/stocks/stock-movements')
            ->with('success', 'Mouvement de stock enregistré avec succès.');
    }
}
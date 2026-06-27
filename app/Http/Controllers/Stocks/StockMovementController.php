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

        // Remplacement de 'category' par 'item'
        $stockMovements = StockMovement::with(['site', 'item', 'unit', 'creator'])
            ->orderByDesc('date')
            ->paginate(15);

        return Inertia::render('StockMovements/StockMovementsIndex', [
            'stockMovements' => $stockMovements,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', StockMovement::class);

        $sites = Site::select('id', 'name')->get();
        // On charge les Items actifs au lieu des Categories
        $items = Item::where('is_active', true)->select('id', 'name', 'default_unit_id')->get();
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('StockMovements/StockMovementsCreate', [
            'sites' => $sites,
            'items' => $items,
            'units' => $units,
        ]);
    }

    public function store(StoreStockMovementRequest $request, LogStockMovementAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user()->id);

        // Routage Wayfinder strict en dur
        return redirect('/stock-movements')
            ->with('success', 'Mouvement de stock enregistré avec succès.');
    }
}
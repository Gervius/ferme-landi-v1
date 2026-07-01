<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveProductionAction;
use App\Actions\Zootechnie\LogProductionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreDailyProductionRequest;
use App\Models\DailyProduction;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

final class DailyProductionController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', DailyProduction::class);

        // 🔴 CORRECTION : Bascule de item_category_id vers item_id
        $data = DailyProduction::query()
            ->select(['id', 'generation_id', 'unit_id', 'item_id', 'date', 'good_quantity', 'broken_quantity', 'status', 'prepared_by']) // item_id
            ->with([
                'generation:id,code,type', 
                'unit:id,name,symbol', 
                'item:id,name' // item au lieu de category
            ])
            ->orderByDesc('date')
            ->paginate(15);

        // INJECTION MODALE
        $generations = \App\Models\Generation::where('status', 'actif')->get(['id', 'code', 'type']);
        $units = \App\Models\Unit::where('is_active', true)->get(['id', 'name', 'symbol']);
        
        // Chargement des articles (Items) filtrés par la catégorie "Produit"
        $items = \App\Models\Item::whereHas('category', function ($query) {
                $query->where('scope', 'product');
            })
            ->where('is_active', true)
            ->get(['id', 'name']);

        return Inertia::render('Zootechnie/DailyProduction/Index', [
            'data' => $data,
            'generations' => $generations,
            'items'  => $items, // items au lieu de categories
            'units'       => $units,
        ]);
    }

    public function store(StoreDailyProductionRequest $request, LogProductionAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user()->id);

        // WAYFINDER STRICT
        return redirect('/zootechnie/daily-productions')->with('success', 'Production enregistrée en brouillon.');
    }

    public function approve(Request $request, DailyProduction $dailyProduction, ApproveProductionAction $action): RedirectResponse
    {
        Gate::authorize('manage generations');

        // Passage de l'ID pour le lockForUpdate dans l'Action
        $action->execute($dailyProduction->id, $request->user()->id);

        // WAYFINDER STRICT
        return redirect('/zootechnie/daily-productions')->with('success', 'Production validée et stock mis à jour.');
    }
}
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

class DailyProductionController extends Controller
{
    public function index()
    {
        // 1. SÉCURITÉ : On bloque l'accès à ceux qui n'ont pas le droit de voir les productions
        Gate::authorize('viewAny', DailyProduction::class);

        // 2. DONNÉES DU TABLEAU
        $data = DailyProduction::with(['generation', 'unit', 'category'])->paginate(15);

        // 3. DONNÉES POUR LA MODALE DE CRÉATION (Demande du Frontend)
        $generations = \App\Models\Generation::where('status', 'actif')->get(['id', 'code', 'type']);
        $categories = \App\Models\Category::where('scope', \App\Enums\CategoryScope::PRODUCT->value)->get(['id', 'name']);
        $units = \App\Models\Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Zootechnie/DailyProduction/Index', [
            'data' => $data,
            'generations' => $generations,
            'categories'  => $categories,
            'units'       => $units,
        ]);
    }

    // ASTUCE ARCHITECTURE : La méthode create() a été supprimée car elle est devenue inutile.

    public function store(StoreDailyProductionRequest $request, LogProductionAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('dailyProductionsIndex')
            ->with('success', 'Production enregistrée en brouillon.');
    }

    public function approve(Request $request, DailyProduction $dailyProduction, ApproveProductionAction $action)
    {
        Gate::authorize('manage generations');

        // On utilise l'objet $request injecté !
        $action->execute($dailyProduction, $request->user()->id);

        return redirect()->route('dailyProductionsIndex')
            ->with('success', 'Production validée et stock mis à jour.');
    }
}
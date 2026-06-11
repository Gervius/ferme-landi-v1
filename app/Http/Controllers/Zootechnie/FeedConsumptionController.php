<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveFeedConsumptionAction;
use App\Actions\Zootechnie\LogFeedConsumptionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFeedConsumptionRequest;
use App\Models\FeedConsumption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FeedConsumptionController extends Controller
{
    public function index()
    {
        // 1. SÉCURITÉ : Restreindre l'accès à la liste
        Gate::authorize('viewAny', FeedConsumption::class);

        // 2. DONNÉES DU TABLEAU
        $data = FeedConsumption::with(['generation', 'unit', 'category'])->paginate(15);

        // 3. DONNÉES POUR LA MODALE DE CRÉATION
        $generations = \App\Models\Generation::where('status', 'actif')->get(['id', 'code', 'type']);
        $units = \App\Models\Unit::where('is_active', true)->get(['id', 'name', 'symbol']);
        $categories = \App\Models\Category::where('scope', \App\Enums\CategoryScope::FEED->value)->get(['id', 'name']);

        return Inertia::render('Zootechnie/FeedConsumption/Index', [
            'data' => $data,
            'generations' => $generations,
            'units' => $units,
            'categories' => $categories,
        ]);
    }

    public function store(StoreFeedConsumptionRequest $request, LogFeedConsumptionAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('feedConsumptionsIndex')
            ->with('success', 'Consommation d\'aliment enregistrée en brouillon.');
    }

    public function approve(Request $request, FeedConsumption $feedConsumption, ApproveFeedConsumptionAction $action)
    {
        Gate::authorize('manage generations');

        // Utilisation propre de l'objet $request injecté (plus de soulignement rouge !)
        $action->execute($feedConsumption, $request->user()->id);

        return redirect()->route('feedConsumptionsIndex')
            ->with('success', 'Consommation validée et stock mis à jour.');
    }
}
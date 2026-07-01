<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveFeedConsumptionAction;
use App\Actions\Zootechnie\LogFeedConsumptionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFeedConsumptionRequest;
use App\Models\FeedConsumption;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class FeedConsumptionController extends Controller
{
    // AJOUT DU TYPE DE RETOUR : Response
    public function index(): Response
    {
        Gate::authorize('viewAny', FeedConsumption::class);
        
        $data = FeedConsumption::select([
                'id', 'generation_id', 'item_id', 'unit_id', 'date', // item_id au lieu de item_category_id
                'quantity', 'total_base_quantity', 'status', 'prepared_by',
                'approved_by', 'approved_at'
            ])
            ->with([
                'generation:id,code,type',
                'unit:id,name,symbol',
                'item:id,name' // item au lieu de category
            ])
            ->paginate(15);

        $generations = \App\Models\Generation::where('status', 'actif')
            ->get(['id', 'code', 'type']);
        $units = \App\Models\Unit::where('is_active', true)
            ->get(['id', 'name', 'symbol']);
            
        // Chargement des articles (Items) filtrés par la catégorie "Aliment"
        $items = \App\Models\Item::whereHas('category', function ($query) {
                $query->where('scope', \App\Enums\CategoryScope::FEED->value);
            })
            ->where('is_active', true)
            ->get(['id', 'name']);

        return Inertia::render('Zootechnie/FeedConsumption/Index', [
            'data' => $data,
            'generations' => $generations,
            'units' => $units,
            'items' => $items, // items au lieu de categories
        ]);
    }

    // AJOUT DU TYPE DE RETOUR : RedirectResponse
    public function store(StoreFeedConsumptionRequest $request, LogFeedConsumptionAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect('/zootechnie/feed-consumptions')
            ->with('success', 'Consommation d\'aliment enregistrée en brouillon.');
    }

    // AJOUT DU TYPE DE RETOUR : RedirectResponse
    public function approve(Request $request, FeedConsumption $feedConsumption, ApproveFeedConsumptionAction $action): RedirectResponse
    {
        Gate::authorize('manage generations');

        $action->execute($feedConsumption, $request->user()->id);

        return redirect('/zootechnie/feed-consumptions')
            ->with('success', 'Consommation validée et stock mis à jour.');
    }
}
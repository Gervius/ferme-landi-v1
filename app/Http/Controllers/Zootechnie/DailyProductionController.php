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

        // OPTIMISATION ABSOLUE DU SELECT
        $data = DailyProduction::query()
            ->select(['id', 'generation_id', 'unit_id', 'item_category_id', 'date', 'good_quantity', 'broken_quantity', 'status', 'prepared_by'])
            ->with([
                'generation:id,code,type', 
                'unit:id,name,symbol', 
                'category:id,name'
            ])
            ->orderByDesc('date')
            ->paginate(15);

        // INJECTION MODALE
        $generations = \App\Models\Generation::where('status', 'actif')->get(['id', 'code', 'type']);
        $categories = \App\Models\Category::where('scope', 'product')->get(['id', 'name']);
        $units = \App\Models\Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Zootechnie/DailyProduction/Index', [
            'data' => $data,
            'generations' => $generations,
            'categories'  => $categories,
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
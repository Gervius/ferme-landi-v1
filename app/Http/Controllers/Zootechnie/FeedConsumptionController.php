<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveFeedConsumptionAction;
use App\Actions\Zootechnie\LogFeedConsumptionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFeedConsumptionRequest;
use App\Models\FeedConsumption;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FeedConsumptionController extends Controller
{
    public function index()
    {
        $data = FeedConsumption::with(['generation', 'unit', 'category'])->paginate(15);

        return Inertia::render('Zootechnie/FeedConsumption/Index', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        // C'est toujours mieux de rajouter la sécurité Gate ici !
        \Illuminate\Support\Facades\Gate::authorize('create', \App\Models\FeedConsumption::class);

        $generations = \App\Models\Generation::where('status', 'actif')->get(['id', 'code', 'type']);
        $units = \App\Models\Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        // CORRECTION ICI : On utilise whereIn pour ratisser plus large
        $categories = \App\Models\Category::whereIn('scope', [
            \App\Enums\CategoryScope::INVENTORY->value,
            \App\Enums\CategoryScope::PURCHASES->value
        ])->get(['id', 'name']);

        return Inertia::render('Zootechnie/FeedConsumption/Create', [
            'generations' => $generations,
            'units' => $units,
            'categories' => $categories,
        ]);
    }

    public function store(StoreFeedConsumptionRequest $request, LogFeedConsumptionAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('feedConsumptionsIndex')
            ->with('success', 'Feed consumption recorded in draft status.');
    }

    public function approve(FeedConsumption $feedConsumption, ApproveFeedConsumptionAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($feedConsumption, request()->user()->id);

        return redirect()->route('feedConsumptionsIndex')
            ->with('success', 'Feed consumption approved successfully.');
    }
}

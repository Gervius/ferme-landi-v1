<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveMortalityAction;
use App\Actions\Zootechnie\LogMortalityAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockMortalityRequest;
use App\Models\FlockMortality;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FlockMortalityController extends Controller
{
    public function index()
    {
        $data = FlockMortality::with('generation')->paginate(15);

        return Inertia::render('Zootechnie/FlockMortality/Index', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        $generations = \App\Models\Generation::where('status', 'actif')->get(['id', 'code', 'type', 'current_quantity']);

        return Inertia::render('Zootechnie/FlockMortality/Create', [
            'generations' => $generations,
        ]);
    }

    public function store(StoreFlockMortalityRequest $request, LogMortalityAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('flockMortalitiesIndex')
            ->with('success', 'Mortality recorded in draft status.');
    }

    public function approve(FlockMortality $flockMortality, ApproveMortalityAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($flockMortality, request()->user()->id);

        return redirect()->route('flockMortalitiesIndex')
            ->with('success', 'Mortality approved successfully.');
    }
}

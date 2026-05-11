<?php

namespace App\Http\Controllers;

use App\Actions\Zootechnie\RegisterBirthOrArrivalAction;
use App\Http\Requests\Zootechnie\StoreGenerationRequest;
use App\Models\Breed;
use App\Models\Generation;
use App\Models\Site;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class GenerationController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Generation::class);

        $generations = Generation::with(['site', 'breed'])->paginate(10);

        return Inertia::render('Generations/Index', [
            'generations' => $generations,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Generation::class);

        $sites = Site::select('id', 'name')->get();
        $breeds = Breed::select('id', 'name')->get();

        return Inertia::render('Generations/Create', [
            'sites' => $sites,
            'breeds' => $breeds,
        ]);
    }

    public function store(StoreGenerationRequest $request, RegisterBirthOrArrivalAction $createAction): RedirectResponse
    {
        $createAction->execute($request->validated());
        return redirect()->route('generationsIndex')->with('success', 'Generation registered successfully.');
    }
}

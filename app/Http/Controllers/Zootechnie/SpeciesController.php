<?php

namespace App\Http\Controllers\Zootechnie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreSpeciesRequest;
use App\Http\Requests\Zootechnie\UpdateSpeciesRequest;
use App\Models\Species;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SpeciesController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Species::class);

        $species = Species::paginate(15);

        return Inertia::render('Zootechnie/Species/Index', [
            'species' => $species,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Species::class);

        return Inertia::render('Zootechnie/Species/Create');
    }

    public function store(StoreSpeciesRequest $request): RedirectResponse
    {
        Species::create($request->validated());

        return redirect()->route('speciesIndex')->with('success', 'Species created successfully.');
    }

    public function edit(Species $species): Response
    {
        Gate::authorize('update', $species);

        return Inertia::render('Zootechnie/Species/Edit', [
            'species' => $species,
        ]);
    }

    public function update(UpdateSpeciesRequest $request, Species $species): RedirectResponse
    {
        $species->update($request->validated());

        return redirect()->route('speciesIndex')->with('success', 'Species updated successfully.');
    }

    public function destroy(Species $species): RedirectResponse
    {
        Gate::authorize('delete', $species);

        $species->delete();

        return redirect()->route('speciesIndex')->with('success', 'Species deleted successfully.');
    }
}

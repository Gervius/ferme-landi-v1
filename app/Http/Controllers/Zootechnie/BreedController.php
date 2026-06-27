<?php

namespace App\Http\Controllers\Zootechnie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreBreedRequest;
use App\Http\Requests\Zootechnie\UpdateBreedRequest;
use App\Models\Breed;
use App\Models\Species;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class BreedController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Breed::class);

        // OPTIMISATION RAM : select() strict incluant la clé étrangère 'species_id'
        $breeds = Breed::query()
            ->select(['id', 'species_id', 'name', 'is_active'])
            ->with(['species:id,name']) // Eager loading bridé
            ->paginate(15);

        // Injection pour le Modal de création/édition
        $species = Species::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Zootechnie/Breed/Index', [
            'breeds' => $breeds,
            'species' => $species, 
        ]);
    }

    public function store(StoreBreedRequest $request): RedirectResponse
    {
        Breed::create($request->validated());

        // WAYFINDER STRICT
        return redirect('/zootechnie/breeds')->with('success', 'Race ajoutée avec succès.');
    }

    public function update(UpdateBreedRequest $request, Breed $breed): RedirectResponse
    {
        $breed->update($request->validated());

        // WAYFINDER STRICT
        return redirect('/zootechnie/breeds')->with('success', 'Race mise à jour avec succès.');
    }

    public function destroy(Breed $breed): RedirectResponse
    {
        Gate::authorize('delete', $breed);
        $breed->delete();

        // WAYFINDER STRICT
        return redirect('/zootechnie/breeds')->with('success', 'Race supprimée avec succès.');
    }
}
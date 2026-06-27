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

final class SpeciesController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Species::class);

        // OPTIMISATION RAM : select() strict pour ne pas charger de données inutiles en mémoire vps
        $species = Species::query()
            ->select(['id', 'name', 'is_active'])
            ->paginate(15);

        return Inertia::render('Zootechnie/Species/Index', [
            'species' => $species,
        ]);
    }

    public function store(StoreSpeciesRequest $request): RedirectResponse
    {
        Species::create($request->validated());

        // WAYFINDER STRICT : Redirection par URI dure (Bannissement de route() et de Ziggy)
        return redirect('/zootechnie/species')->with('success', 'Espèce créée avec succès.');
    }

    public function update(UpdateSpeciesRequest $request, Species $species): RedirectResponse
    {
        $species->update($request->validated());

        // WAYFINDER STRICT : Redirection par URI dure
        return redirect('/zootechnie/species')->with('success', 'Espèce mise à jour avec succès.');
    }

    public function destroy(Species $species): RedirectResponse
    {
        Gate::authorize('delete', $species);

        $species->delete();

        // WAYFINDER STRICT : Redirection par URI dure
        return redirect('/zootechnie/species')->with('success', 'Espèce supprimée avec succès.');
    }
}
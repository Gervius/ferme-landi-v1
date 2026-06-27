<?php

namespace App\Http\Controllers\Zootechnie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreBreedStandardRequest;
use App\Http\Requests\Zootechnie\UpdateBreedStandardRequest;
use App\Models\Breed;
use App\Models\BreedStandard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class BreedStandardController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', BreedStandard::class);

        // OPTIMISATION RAM : Seulement les colonnes utiles à la Data Table
        $standards = BreedStandard::query()
            ->select([
                'id', 
                'breed_id', 
                'target_laying_start_age', 
                'target_culling_age', 
                'peak_laying_rate', 
                'target_daily_feed_intake'
            ])
            ->with(['breed:id,name'])
            ->paginate(15);

        // Injection pour les Modals
        $breeds = Breed::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Zootechnie/BreedStandard/Index', [
            'standards' => $standards,
            'breeds' => $breeds, 
        ]);
    }

    public function store(StoreBreedStandardRequest $request): RedirectResponse
    {
        BreedStandard::create($request->validated());

        // WAYFINDER STRICT
        return redirect('/zootechnie/breed-standards')->with('success', 'Standard de race créé avec succès.');
    }

    public function update(UpdateBreedStandardRequest $request, BreedStandard $breedStandard): RedirectResponse
    {
        $breedStandard->update($request->validated());

        // WAYFINDER STRICT
        return redirect('/zootechnie/breed-standards')->with('success', 'Standard mis à jour avec succès.');
    }

    public function destroy(BreedStandard $breedStandard): RedirectResponse
    {
        Gate::authorize('delete', $breedStandard);
        $breedStandard->delete();

        // WAYFINDER STRICT
        return redirect('/zootechnie/breed-standards')->with('success', 'Standard supprimé avec succès.');
    }
}
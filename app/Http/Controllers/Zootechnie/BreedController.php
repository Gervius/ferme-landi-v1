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

class BreedController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Breed::class);

        $breeds = Breed::with('species')->paginate(15);

        $species = Species::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Zootechnie/Breed/Index', [
            'breeds' => $breeds,
            'species' => $species, // Injection ici
        ]);
    }

    

    public function store(StoreBreedRequest $request): RedirectResponse
    {
        Breed::create($request->validated());

        return redirect()->route('breedsIndex')->with('success', 'Breed created successfully.');
    }

    public function edit(Breed $breed): Response
    {
        Gate::authorize('update', $breed);

        $species = Species::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Zootechnie/Breed/Edit', [
            'breed' => $breed,
            'species' => $species,
        ]);
    }

    public function update(UpdateBreedRequest $request, Breed $breed): RedirectResponse
    {
        $breed->update($request->validated());

        return redirect()->route('breedsIndex')->with('success', 'Breed updated successfully.');
    }

    public function destroy(Breed $breed): RedirectResponse
    {
        Gate::authorize('delete', $breed);

        $breed->delete();

        return redirect()->route('breedsIndex')->with('success', 'Breed deleted successfully.');
    }
}

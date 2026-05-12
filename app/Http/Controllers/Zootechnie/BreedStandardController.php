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

class BreedStandardController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', BreedStandard::class);

        $standards = BreedStandard::with('breed')->paginate(15);

        return Inertia::render('Zootechnie/BreedStandard/Index', [
            'standards' => $standards,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', BreedStandard::class);

        $breeds = Breed::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Zootechnie/BreedStandard/Create', [
            'breeds' => $breeds,
        ]);
    }

    public function store(StoreBreedStandardRequest $request): RedirectResponse
    {
        BreedStandard::create($request->validated());

        return redirect()->route('breedStandardsIndex')
            ->with('success', 'Breed standard created successfully.');
    }

    public function edit(BreedStandard $breedStandard): Response
    {
        Gate::authorize('update', $breedStandard);

        $breeds = Breed::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Zootechnie/BreedStandard/Edit', [
            'breedStandard' => $breedStandard,
            'breeds' => $breeds,
        ]);
    }

    public function update(UpdateBreedStandardRequest $request, BreedStandard $breedStandard): RedirectResponse
    {
        $breedStandard->update($request->validated());

        return redirect()->route('breedStandardsIndex')
            ->with('success', 'Breed standard updated successfully.');
    }

    public function destroy(BreedStandard $breedStandard): RedirectResponse
    {
        Gate::authorize('delete', $breedStandard);

        $breedStandard->delete();

        return redirect()->route('breedStandardsIndex')
            ->with('success', 'Breed standard deleted successfully.');
    }
}

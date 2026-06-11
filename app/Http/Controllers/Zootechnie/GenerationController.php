<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\RegisterBirthOrArrivalAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreGenerationRequest;
use App\Models\Breed;
use App\Models\Generation;
use App\Models\Site;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Inertia\Response;

class GenerationController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Generation::class);

        // Construction dynamique de la requête
        $query = Generation::with(['site', 'breed']);

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('search')) {
            $query->where('code', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $generations = $query->paginate(10)->withQueryString();

        // Requête groupée pour les badges du Frontend (ex: statut 'actif')
        $activeLotsCount = Generation::where('status', 'actif')
            ->selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type');

        return Inertia::render('Generations/Index', [
            'generations' => $generations,
            'activeLotsCount' => $activeLotsCount,
            'filters' => $request->only(['type', 'search', 'status']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Generation::class);

        $sites = Site::where('is_active', true)->select('id', 'name')->get();
        $breeds = Breed::where('is_active', true)->select('id', 'name')->get();

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

    public function edit(Generation $generation): Response
    {
        Gate::authorize('update', $generation);

        $sites = Site::where('is_active', true)->select('id', 'name')->get();
        $breeds = Breed::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Generations/Edit', [
            'generation' => $generation,
            'sites' => $sites,
            'breeds' => $breeds,
        ]);
    }

    public function update(
        \App\Http\Requests\Zootechnie\UpdateGenerationRequest $request,
        Generation $generation,
        \App\Actions\Zootechnie\UpdateGenerationAction $updateAction
    ): RedirectResponse {
        $updateAction->execute($generation, $request->validated());

        return redirect()->route('generationsIndex')->with('success', 'Generation updated successfully.');
    }

    public function destroy(Generation $generation): RedirectResponse
    {
        Gate::authorize('delete', $generation);

        $generation->delete();

        return redirect()->route('generationsIndex')->with('success', 'Generation deleted successfully.');
    }
}

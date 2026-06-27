<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\RegisterBirthOrArrivalAction;
use App\Actions\Zootechnie\UpdateGenerationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreGenerationRequest;
use App\Http\Requests\Zootechnie\UpdateGenerationRequest;
use App\Models\Breed;
use App\Models\Generation;
use App\Models\Site;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Inertia\Response;

final class GenerationController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Generation::class);

        // OPTIMISATION RAM & RÉSEAU : select() strict et with() bridé
        $query = Generation::query()
            ->select(['id', 'site_id', 'breed_id', 'code', 'type', 'start_date', 'initial_quantity', 'current_quantity', 'status', 'observation'])
            ->with([
                'site:id,name', 
                'breed:id,name'
            ]);

        // Filtrage optimisé
        if ($request->filled('type') && $request->input('type') !== 'all') {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('search')) {
            $query->where('code', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $generations = $query->paginate(10)->withQueryString();

        // Données groupées légères
        $activeLotsCount = Generation::where('status', 'actif')
            ->groupBy('type')
            ->selectRaw('type, count(*) as count')
            ->pluck('count', 'type');

        // INJECTION POUR LES MODALS (On ne charge que ce qui est vital pour les balises <select>)
        $sites = Site::where('is_active', true)->get(['id', 'name']);
        $breeds = Breed::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Generations/Index', [
            'generations' => $generations,
            'activeLotsCount' => $activeLotsCount,
            'filters' => $request->only(['type', 'search', 'status']),
            // Données pour alimenter les Modals Shadcn/Radix de Création et d'Édition
            'sites' => $sites,
            'breeds' => $breeds,
        ]);
    }

    public function store(StoreGenerationRequest $request, RegisterBirthOrArrivalAction $createAction): RedirectResponse
    {
        $createAction->execute($request->validated());
        
        // WAYFINDER STRICT : Hard URIs, pas de route()
        return redirect('/zootechnie/generations')->with('success', 'Génération enregistrée avec succès.');
    }

    public function update(UpdateGenerationRequest $request, Generation $generation, UpdateGenerationAction $updateAction): RedirectResponse 
    {
        $updateAction->execute($generation, $request->validated());

        // WAYFINDER STRICT
        return redirect('/zootechnie/generations')->with('success', 'Lot mis à jour avec succès.');
    }

    public function destroy(Generation $generation): RedirectResponse
    {
        Gate::authorize('delete', $generation);
        $generation->delete();

        // WAYFINDER STRICT
        return redirect('/zootechnie/generations')->with('success', 'Lot supprimé.');
    }
}
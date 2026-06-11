<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveMortalityAction;
use App\Actions\Zootechnie\LogMortalityAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockMortalityRequest;
use App\Models\FlockMortality;
use Illuminate\Http\Request; // Ajout de l'import Request
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FlockMortalityController extends Controller
{
    public function index()
    {
        // 1. SÉCURITÉ
        Gate::authorize('viewAny', FlockMortality::class);

        // 2. DONNÉES DU TABLEAU
        $data = FlockMortality::with('generation')->paginate(15);

        // 3. DONNÉES POUR LA MODALE (Déplacées depuis l'ancienne méthode create)
        $generations = \App\Models\Generation::where('status', 'actif')
            ->get(['id', 'code', 'type', 'current_quantity']);

        return Inertia::render('Zootechnie/FlockMortality/Index', [
            'data' => $data,
            'generations' => $generations,
        ]);
    }

    public function store(StoreFlockMortalityRequest $request, LogMortalityAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('flockMortalitiesIndex')
            ->with('success', 'Mortalité enregistrée en brouillon.');
    }

    public function approve(Request $request, FlockMortality $flockMortality, ApproveMortalityAction $action)
    {
        Gate::authorize('manage generations');

        // Utilisation de l'objet $request injecté
        $action->execute($flockMortality, $request->user()->id);

        return redirect()->route('flockMortalitiesIndex')
            ->with('success', 'Mortalité validée et cheptel mis à jour.');
    }
}
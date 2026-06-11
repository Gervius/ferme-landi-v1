<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveCullingAction;
use App\Actions\Zootechnie\LogFlockCullingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockCullingRequest;
use App\Models\FlockCulling;
use Illuminate\Http\Request; // Ajout de l'import Request
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FlockCullingController extends Controller
{
    public function index()
    {
        // 1. SÉCURITÉ
        Gate::authorize('viewAny', FlockCulling::class);

        // 2. DONNÉES DU TABLEAU
        $data = FlockCulling::with('generation')->paginate(15);

        // 3. DONNÉES POUR LA MODALE (Déplacées depuis l'ancienne méthode create)
        $generations = \App\Models\Generation::where('status', 'actif')
            ->get(['id', 'code', 'type', 'current_quantity']);

        return Inertia::render('Zootechnie/FlockCulling/Index', [
            'data' => $data,
            'generations' => $generations,
        ]);
    }

    public function store(StoreFlockCullingRequest $request, LogFlockCullingAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('flockCullingsIndex')
            ->with('success', 'Réforme enregistrée en brouillon.');
    }

    public function approve(Request $request, FlockCulling $flockCulling, ApproveCullingAction $action)
    {
        Gate::authorize('manage generations');

        // Utilisation de l'objet $request injecté
        $action->execute($flockCulling, $request->user()->id);

        return redirect()->route('flockCullingsIndex')
            ->with('success', 'Réforme validée et cheptel mis à jour.');
    }
}
<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveWeighingAction;
use App\Actions\Zootechnie\LogWeighingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockWeighingRequest;
use App\Models\FlockWeighing;
use App\Models\Generation;
use Illuminate\Http\Request; // Ajout de l'import Request
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FlockWeighingController extends Controller
{
    public function index()
    {
        // 1. SÉCURITÉ
        Gate::authorize('viewAny', FlockWeighing::class);

        // 2. DONNÉES DU TABLEAU
        $data = FlockWeighing::with('generation')->paginate(15);

        // 3. DONNÉES POUR LA MODALE (Déplacées depuis l'ancienne méthode create)
        // Capabilities allow weighing only for 'chair' or 'porc'
        $generations = Generation::where('status', 'actif')
            ->whereIn('type', ['chair', 'porc'])
            ->get(['id', 'code', 'type']);

        return Inertia::render('Zootechnie/FlockWeighing/Index', [
            'data' => $data,
            'generations' => $generations,
        ]);
    }

    public function store(StoreFlockWeighingRequest $request, LogWeighingAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('flockWeighingsIndex')
            ->with('success', 'Pesée enregistrée en brouillon.');
    }

    public function approve(Request $request, FlockWeighing $flockWeighing, ApproveWeighingAction $action)
    {
        Gate::authorize('manage generations');

        // Utilisation de l'objet $request injecté
        $action->execute($flockWeighing, $request->user()->id);

        return redirect()->route('flockWeighingsIndex')
            ->with('success', 'Pesée validée avec succès.');
    }
}
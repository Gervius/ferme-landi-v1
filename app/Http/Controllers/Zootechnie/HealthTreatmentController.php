<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveHealthTreatmentAction;
use App\Actions\Zootechnie\LogHealthTreatmentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreHealthTreatmentRequest;
use App\Models\Generation;
use App\Models\HealthTreatment;
use Illuminate\Http\Request; // Ajout de l'import Request
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class HealthTreatmentController extends Controller
{
    public function index()
    {
        // 1. SÉCURITÉ
        Gate::authorize('viewAny', HealthTreatment::class);

        // 2. DONNÉES DU TABLEAU
        $data = HealthTreatment::with('generation')->paginate(15);

        // 3. DONNÉES POUR LA MODALE (Déplacées depuis l'ancienne méthode create)
        $generations = Generation::where('status', 'actif')
            ->get(['id', 'code', 'type']);

        return Inertia::render('Zootechnie/HealthTreatment/Index', [
            'data' => $data,
            'generations' => $generations,
        ]);
    }

    public function store(StoreHealthTreatmentRequest $request, LogHealthTreatmentAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('healthTreatmentsIndex')
            ->with('success', 'Traitement sanitaire enregistré en brouillon.');
    }

    public function approve(Request $request, HealthTreatment $healthTreatment, ApproveHealthTreatmentAction $action)
    {
        Gate::authorize('manage generations');

        // Utilisation de l'objet $request injecté
        $action->execute($healthTreatment, $request->user()->id);

        return redirect()->route('healthTreatmentsIndex')
            ->with('success', 'Traitement sanitaire validé avec succès.');
    }
}
<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveHealthTreatmentAction;
use App\Actions\Zootechnie\LogHealthTreatmentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreHealthTreatmentRequest;
use App\Models\Generation;
use App\Models\HealthTreatment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class HealthTreatmentController extends Controller
{
    // AJOUT TYPE DE RETOUR PHP 8.4+
    public function index(): Response
    {
        Gate::authorize('viewAny', HealthTreatment::class);

        // 🔴 CORRECTION BUG SQL : Réalignement des colonnes sur la vraie structure de la table
        $data = HealthTreatment::select([
                'id', 'generation_id', 'date', 'disease_description',
                'medication_name', 'dosage_description', 'veterinarian_name',
                'status', 'prepared_by', 'approved_by', 'approved_at'
            ])
            ->with(['generation:id,code,type'])
            ->paginate(15);

        $generations = Generation::where('status', 'actif')
            ->get(['id', 'code', 'type']);

        return Inertia::render('Zootechnie/HealthTreatment/Index', [
            'data' => $data,
            'generations' => $generations,
        ]);
    }

    // AJOUT TYPE DE RETOUR PHP 8.4+
    public function store(StoreHealthTreatmentRequest $request, LogHealthTreatmentAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user()->id);

        // WAYFINDER STRICT
        return redirect('/zootechnie/health-treatments')
            ->with('success', 'Traitement sanitaire enregistré en brouillon.');
    }

    // AJOUT TYPE DE RETOUR PHP 8.4+
    public function approve(Request $request, HealthTreatment $healthTreatment, ApproveHealthTreatmentAction $action): RedirectResponse
    {
        Gate::authorize('manage generations');

        $action->execute($healthTreatment, $request->user()->id);

        // WAYFINDER STRICT
        return redirect('/zootechnie/health-treatments')
            ->with('success', 'Traitement sanitaire validé avec succès.');
    }
}
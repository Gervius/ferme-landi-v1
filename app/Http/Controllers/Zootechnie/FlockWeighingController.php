<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveWeighingAction;
use App\Actions\Zootechnie\LogWeighingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockWeighingRequest;
use App\Models\FlockWeighing;
use App\Models\Generation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

final class FlockWeighingController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', FlockWeighing::class);

        // OPTIMISATION : select() sur les colonnes nécessaires
        $data = FlockWeighing::select([
                'id', 'generation_id', 'date', 'average_weight',
                'weighed_subjects_count', 'status', 'prepared_by',
                'approved_by', 'approved_at'
            ])
            ->with(['generation:id,code,type'])
            ->paginate(15);

        // Uniquement les générations de type chair ou porc (capables d'être pesées)
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

        // WAYFINDER : URI dure
        return redirect('/zootechnie/flock-weighings')
            ->with('success', 'Pesée enregistrée en brouillon.');
    }

    public function approve(Request $request, FlockWeighing $flockWeighing, ApproveWeighingAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($flockWeighing, $request->user()->id);

        // WAYFINDER : URI dure
        return redirect('/zootechnie/flock-weighings')
            ->with('success', 'Pesée validée avec succès.');
    }
}
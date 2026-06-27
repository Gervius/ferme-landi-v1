<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveCullingAction;
use App\Actions\Zootechnie\LogFlockCullingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockCullingRequest;
use App\Models\FlockCulling;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

final class FlockCullingController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', FlockCulling::class);

        // OPTIMISATION : select() sur les champs nécessaires + relation restreinte
        $data = FlockCulling::select([
                'id', 'generation_id', 'date', 'quantity_culled', 'reason',
                'weight_kg', 'status', 'prepared_by', 'approved_by', 'approved_at'
            ])
            ->with(['generation:id,code,type,current_quantity'])
            ->paginate(15);

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

        // WAYFINDER : URI dure
        return redirect('/zootechnie/flock-cullings')
            ->with('success', 'Réforme enregistrée en brouillon.');
    }

    public function approve(Request $request, FlockCulling $flockCulling, ApproveCullingAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($flockCulling, $request->user()->id);

        // WAYFINDER : URI dure
        return redirect('/zootechnie/flock-cullings')
            ->with('success', 'Réforme validée et cheptel mis à jour.');
    }
}
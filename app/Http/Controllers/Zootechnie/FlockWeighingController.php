<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveWeighingAction;
use App\Actions\Zootechnie\LogWeighingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockWeighingRequest;
use App\Models\FlockWeighing;
use App\Models\Generation;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FlockWeighingController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', FlockWeighing::class);

        $data = FlockWeighing::with('generation')->paginate(15);

        return Inertia::render('Zootechnie/FlockWeighing/Index', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', FlockWeighing::class);

        // Capabilities allow weighing only for 'chair' or 'porc'
        $generations = Generation::where('status', 'actif')
            ->whereIn('type', ['chair', 'porc'])
            ->get(['id', 'code', 'type']);

        return Inertia::render('Zootechnie/FlockWeighing/Create', [
            'generations' => $generations,
        ]);
    }

    public function store(StoreFlockWeighingRequest $request, LogWeighingAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('flockWeighingsIndex')
            ->with('success', 'Flock weighing recorded in draft status.');
    }

    public function approve(FlockWeighing $flockWeighing, ApproveWeighingAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($flockWeighing, request()->user()->id);

        return redirect()->route('flockWeighingsIndex')
            ->with('success', 'Flock weighing approved successfully.');
    }
}

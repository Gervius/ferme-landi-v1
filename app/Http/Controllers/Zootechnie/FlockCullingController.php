<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveCullingAction;
use App\Actions\Zootechnie\LogFlockCullingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockCullingRequest;
use App\Models\FlockCulling;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FlockCullingController extends Controller
{
    public function index()
    {
        $data = FlockCulling::with('generation')->paginate(15);

        return Inertia::render('Zootechnie/FlockCulling/Index', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        $generations = \App\Models\Generation::where('status', 'actif')->get(['id', 'code', 'type', 'current_quantity']);

        return Inertia::render('Zootechnie/FlockCulling/Create', [
            'generations' => $generations,
        ]);
    }

    public function store(StoreFlockCullingRequest $request, LogFlockCullingAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('flockCullingsIndex')
            ->with('success', 'Culling recorded in draft status.');
    }

    public function approve(FlockCulling $flockCulling, ApproveCullingAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($flockCulling, request()->user()->id);

        return redirect()->route('flockCullingsIndex')
            ->with('success', 'Culling approved successfully.');
    }
}

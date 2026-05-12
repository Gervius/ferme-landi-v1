<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveHealthTreatmentAction;
use App\Actions\Zootechnie\LogHealthTreatmentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreHealthTreatmentRequest;
use App\Models\Generation;
use App\Models\HealthTreatment;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class HealthTreatmentController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', HealthTreatment::class);

        $data = HealthTreatment::with('generation')->paginate(15);

        return Inertia::render('Zootechnie/HealthTreatment/Index', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', HealthTreatment::class);

        $generations = Generation::where('status', 'actif')
            ->get(['id', 'code', 'type']);

        return Inertia::render('Zootechnie/HealthTreatment/Create', [
            'generations' => $generations,
        ]);
    }

    public function store(StoreHealthTreatmentRequest $request, LogHealthTreatmentAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('healthTreatmentsIndex')
            ->with('success', 'Health treatment recorded in draft status.');
    }

    public function approve(HealthTreatment $healthTreatment, ApproveHealthTreatmentAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($healthTreatment, request()->user()->id);

        return redirect()->route('healthTreatmentsIndex')
            ->with('success', 'Health treatment approved successfully.');
    }
}

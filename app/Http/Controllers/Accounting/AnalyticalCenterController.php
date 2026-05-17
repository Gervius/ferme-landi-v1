<?php

namespace App\Http\Controllers\Accounting;

use App\Actions\Accounting\CreateAnalyticalCenterAction;
use App\Actions\Accounting\DeleteAnalyticalCenterAction;
use App\Actions\Accounting\UpdateAnalyticalCenterAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreAnalyticalCenterRequest;
use App\Http\Requests\Accounting\UpdateAnalyticalCenterRequest;
use App\Models\AnalyticalCenter;
use App\Models\AnalyticalCode;
use App\Models\AnalyticalNature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticalCenterController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', AnalyticalCenter::class);

        $analyticalCenters = AnalyticalCenter::with(['nature', 'analyticalCode'])->orderBy('name')->get();

        return Inertia::render('Accounting/AnalyticalCenters/Index', [
            'analyticalCenters' => $analyticalCenters,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', AnalyticalCenter::class);

        // Respect strict raw fields required for frontend
        $natures = AnalyticalNature::select('id', 'code', 'name')->where('is_active', true)->get();
        $codes = AnalyticalCode::select('id', 'code', 'short_name', 'name')->where('is_active', true)->get();

        return Inertia::render('Accounting/AnalyticalCenters/Create', [
            'natures' => $natures,
            'codes' => $codes,
        ]);
    }

    public function store(StoreAnalyticalCenterRequest $request, CreateAnalyticalCenterAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('analyticalCentersIndex')
            ->with('success', 'Centre analytique créé avec succès.');
    }

    public function edit(AnalyticalCenter $analyticalCenter): Response
    {
        Gate::authorize('update', $analyticalCenter);

        $natures = AnalyticalNature::select('id', 'code', 'name')->where('is_active', true)->get();
        $codes = AnalyticalCode::select('id', 'code', 'short_name', 'name')->where('is_active', true)->get();

        return Inertia::render('Accounting/AnalyticalCenters/Edit', [
            'analyticalCenter' => $analyticalCenter,
            'natures' => $natures,
            'codes' => $codes,
        ]);
    }

    public function update(UpdateAnalyticalCenterRequest $request, AnalyticalCenter $analyticalCenter, UpdateAnalyticalCenterAction $action): RedirectResponse
    {
        $action->execute($analyticalCenter, $request->validated());

        return redirect()->route('analyticalCentersIndex')
            ->with('success', 'Centre analytique mis à jour avec succès.');
    }

    public function destroy(AnalyticalCenter $analyticalCenter, DeleteAnalyticalCenterAction $action): RedirectResponse
    {
        Gate::authorize('delete', $analyticalCenter);

        $action->execute($analyticalCenter);

        return redirect()->route('analyticalCentersIndex')
            ->with('success', 'Centre analytique supprimé avec succès.');
    }
}

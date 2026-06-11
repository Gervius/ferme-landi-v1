<?php

namespace App\Http\Controllers\Accounting;

use App\Actions\Accounting\CreateAnalyticalNatureAction;
use App\Actions\Accounting\DeleteAnalyticalNatureAction;
use App\Actions\Accounting\UpdateAnalyticalNatureAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreAnalyticalNatureRequest;
use App\Http\Requests\Accounting\UpdateAnalyticalNatureRequest;
use App\Models\AnalyticalNature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticalNatureController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', AnalyticalNature::class);

        // CORRECTION : On utilise la pagination
        $analyticalNatures = AnalyticalNature::orderBy('code')->paginate(15);

        return Inertia::render('Accounting/AnalyticalNatures/Index', [
            'analyticalNatures' => $analyticalNatures,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', AnalyticalNature::class);

        return Inertia::render('Accounting/AnalyticalNatures/Create');
    }

    public function store(StoreAnalyticalNatureRequest $request, CreateAnalyticalNatureAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('analyticalNaturesIndex')
            ->with('success', 'Nature analytique créée avec succès.');
    }

    public function edit(AnalyticalNature $analyticalNature): Response
    {
        Gate::authorize('update', $analyticalNature);

        return Inertia::render('Accounting/AnalyticalNatures/Edit', [
            'analyticalNature' => $analyticalNature,
        ]);
    }

    public function update(UpdateAnalyticalNatureRequest $request, AnalyticalNature $analyticalNature, UpdateAnalyticalNatureAction $action): RedirectResponse
    {
        $action->execute($analyticalNature, $request->validated());

        return redirect()->route('analyticalNaturesIndex')
            ->with('success', 'Nature analytique mise à jour avec succès.');
    }

    public function destroy(AnalyticalNature $analyticalNature, DeleteAnalyticalNatureAction $action): RedirectResponse
    {
        Gate::authorize('delete', $analyticalNature);

        $action->execute($analyticalNature);

        return redirect()->route('analyticalNaturesIndex')
            ->with('success', 'Nature analytique supprimée avec succès.');
    }
}

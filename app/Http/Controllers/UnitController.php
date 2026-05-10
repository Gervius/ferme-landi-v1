<?php

namespace App\Http\Controllers;

use App\Actions\Logistics\CreateUnitAction;
use App\Actions\Logistics\UpdateUnitAction;
use App\Http\Requests\Logistics\StoreUnitRequest;
use App\Http\Requests\Logistics\UpdateUnitRequest;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Unit::class);

        $units = Unit::with('baseUnit')->paginate(10);

        return Inertia::render('Units/Index', [
            'units' => $units,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Unit::class);
        $baseUnits = Unit::where('is_base_unit', true)->get();

        return Inertia::render('Units/Create', [
            'baseUnits' => $baseUnits,
        ]);
    }

    public function store(StoreUnitRequest $request, CreateUnitAction $createAction): RedirectResponse
    {
        $createAction->execute($request->validated());
        return redirect()->route('units.index')->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit): Response
    {
        Gate::authorize('update', $unit);
        $baseUnits = Unit::where('is_base_unit', true)->where('id', '!=', $unit->id)->get();

        return Inertia::render('Units/Edit', [
            'unit' => $unit,
            'baseUnits' => $baseUnits,
        ]);
    }

    public function update(UpdateUnitRequest $request, Unit $unit, UpdateUnitAction $updateAction): RedirectResponse
    {
        $updateAction->execute($unit, $request->validated());
        return redirect()->route('units.index')->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        Gate::authorize('delete', $unit);
        $unit->delete();
        return redirect()->route('units.index')->with('success', 'Unit deleted successfully.');
    }
}

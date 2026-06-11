<?php

namespace App\Http\Controllers;

use App\Actions\Logistics\CreateUnitAction;
use App\Actions\Logistics\UpdateUnitAction;
use App\Http\Requests\Logistics\StoreUnitRequest;
use App\Http\Requests\Logistics\UpdateUnitRequest;
use App\Models\Unit;
use App\Enums\UnitType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class UnitController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Unit::class);

        // Optimisation RAM : On limite les données de la base parent au strict minimum (id, name, symbol)
        $units = Unit::select(['id', 'name', 'symbol', 'is_base_unit', 'base_unit_id', 'conversion_rate', 'is_active'])
            ->with(['baseUnit:id,name,symbol'])
            ->paginate(10);

        // Chargement très léger pour le select des unités de référence dans la modale
        $baseUnits = Unit::select(['id', 'name', 'symbol'])
            ->where('is_base_unit', true)
            ->where('is_active', true)
            ->get();

        $unitTypes = array_map(fn($type) => [
            'value' => $type->value,
            'label' => $type->label()
        ], UnitType::cases());

        return Inertia::render('Units/Index', [
            'units' => $units,
            'baseUnits' => $baseUnits,
            'unitTypes' => $unitTypes, // Injection directe
        ]);
    }

    public function store(StoreUnitRequest $request, CreateUnitAction $createAction): RedirectResponse
    {
        $createAction->execute($request->validated());
        
        return redirect('/units')->with('success', 'Unité créée avec succès.');
    }

    public function update(UpdateUnitRequest $request, Unit $unit, UpdateUnitAction $updateAction): RedirectResponse
    {
        $updateAction->execute($unit, $request->validated());
        
        return redirect('/units')->with('success', 'Unité mise à jour avec succès.');
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        Gate::authorize('delete', $unit);
        $unit->delete();
        
        return redirect('/units')->with('success', 'Unité supprimée avec succès.');
    }
}
<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\Purchases\CreateSupplierAction;
use App\Actions\Purchases\DeleteSupplierAction;
use App\Actions\Purchases\UpdateSupplierAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StoreSupplierRequest;
use App\Http\Requests\Purchases\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Supplier::class);
        $data = Supplier::paginate(15);
        return Inertia::render('Purchases/Supplier/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', Supplier::class);
        return Inertia::render('Purchases/Supplier/Create');
    }

    public function store(StoreSupplierRequest $request, CreateSupplierAction $action)
    {
        $action->execute($request->validated());
        return redirect()->route('suppliersIndex')->with('success', 'Supplier created.');
    }

    public function edit(Supplier $supplier)
    {
        Gate::authorize('update', $supplier);
        return Inertia::render('Purchases/Supplier/Edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier, UpdateSupplierAction $action)
    {
        $action->execute($supplier, $request->validated());
        return redirect()->route('suppliersIndex')->with('success', 'Supplier updated.');
    }

    public function destroy(Supplier $supplier, DeleteSupplierAction $action)
    {
        Gate::authorize('delete', $supplier);
        $action->execute($supplier);
        return redirect()->route('suppliersIndex')->with('success', 'Supplier deleted.');
    }
}

<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\Purchases\LogPurchaseOrderAction;
use App\Actions\Purchases\UpdatePurchaseOrderAction;
use App\Actions\Purchases\DeletePurchaseOrderAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchaseOrderRequest;
use App\Http\Requests\Purchases\UpdatePurchaseOrderRequest;
use App\Models\Category;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\Unit;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', PurchaseOrder::class);
        $data = PurchaseOrder::with('supplier')->paginate(15);
        return Inertia::render('Purchases/PurchaseOrder/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', PurchaseOrder::class);

        $suppliers = Supplier::where('is_active', true)->get(['id', 'name']);
        $categories = Category::all(['id', 'name']);
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Purchases/PurchaseOrder/Create', [
            'suppliers'  => $suppliers,
            'categories' => $categories,
            'units'      => $units,
        ]);
    }

    public function store(StorePurchaseOrderRequest $request, LogPurchaseOrderAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        return redirect()->route('purchaseOrdersIndex')->with('success', 'Purchase order created.');
    }

    public function edit(PurchaseOrder $purchaseOrder)
    {
        Gate::authorize('update', $purchaseOrder);

        $suppliers = Supplier::where('is_active', true)->get(['id', 'name']);
        $categories = Category::all(['id', 'name']);
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Purchases/PurchaseOrder/Edit', [
            'purchaseOrder' => $purchaseOrder->load('items', 'supplier'),
            'suppliers'     => $suppliers,
            'categories'    => $categories,
            'units'         => $units,
        ]);
    }

    public function update(UpdatePurchaseOrderRequest $request, PurchaseOrder $purchaseOrder, UpdatePurchaseOrderAction $action)
    {
        $action->execute($purchaseOrder, $request->validated());
        return redirect()->route('purchaseOrdersIndex')->with('success', 'Purchase order updated.');
    }

    public function destroy(PurchaseOrder $purchaseOrder, DeletePurchaseOrderAction $action)
    {
        Gate::authorize('delete', $purchaseOrder);
        $action->execute($purchaseOrder);
        return redirect()->route('purchaseOrdersIndex')->with('success', 'Purchase order deleted.');
    }
}

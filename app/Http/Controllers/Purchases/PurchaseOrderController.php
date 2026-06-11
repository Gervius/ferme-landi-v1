<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\Purchases\LogPurchaseOrderAction;
use App\Actions\Purchases\UpdatePurchaseOrderAction;
use App\Actions\Purchases\DeletePurchaseOrderAction;
use App\Actions\Purchases\GenerateReceiptFromOrderAction;
use App\Actions\Exports\GeneratePurchaseOrderPdfAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchaseOrderRequest;
use App\Http\Requests\Purchases\UpdatePurchaseOrderRequest;
use App\Models\Category;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\site;
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
        $categories = Category::whereIn('scope', [
            \App\Enums\CategoryScope::FEED->value,
            \App\Enums\CategoryScope::ANIMAL->value,
            \App\Enums\CategoryScope::MEDICATION->value,
            \App\Enums\CategoryScope::EQUIPMENT->value,
        ])->get(['id', 'name']);
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);
        $sites = Site::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Purchases/PurchaseOrder/Create', [
            'suppliers'  => $suppliers,
            'categories' => $categories,
            'units'      => $units,
            'sites'      => $sites,
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
        $categories = Category::whereIn('scope', [
            \App\Enums\CategoryScope::FEED->value,
            \App\Enums\CategoryScope::ANIMAL->value,
            \App\Enums\CategoryScope::MEDICATION->value,
            \App\Enums\CategoryScope::EQUIPMENT->value,
        ])->get(['id', 'name']);
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

    public function generateReceipt(PurchaseOrder $purchaseOrder, GenerateReceiptFromOrderAction $action)
    {
        Gate::authorize('update', $purchaseOrder);

        $receipt = $action->execute($purchaseOrder, request()->user()->id);

        return redirect()->route('purchaseReceiptsEdit', $receipt->id)
            ->with('success', 'Bon de réception généré avec succès. Veuillez le vérifier.');
    }

    public function showApi(PurchaseOrder $purchaseOrder)
    {
        Gate::authorize('view', $purchaseOrder);

        return response()->json($purchaseOrder->load(['items.category', 'items.unit']));
    }

    public function downloadPdf(PurchaseOrder $purchaseOrder, GeneratePurchaseOrderPdfAction $action)
    {
        Gate::authorize('view', $purchaseOrder);

        $pdf = $action->execute($purchaseOrder);

        return $pdf->stream($purchaseOrder->reference . '.pdf');
    }
}

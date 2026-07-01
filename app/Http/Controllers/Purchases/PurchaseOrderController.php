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
use App\Actions\Purchases\ApprovePurchaseOrderAction;
use App\Models\Item; // Remplacement de Category
use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\Site;
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
        
        // Chargement des Articles au lieu des Catégories
        $items = Item::where('is_active', true)->select('id', 'name', 'default_unit_id')->get();
        
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);
        $sites = Site::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Purchases/PurchaseOrder/Create', [
            'suppliers'  => $suppliers,
            'items'      => $items, // Remplacement
            'units'      => $units,
            'sites'      => $sites,
        ]);
    }

    public function store(StorePurchaseOrderRequest $request, LogPurchaseOrderAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        
        
        return redirect('/purchases/purchase-orders')->with('success', 'Bon de commande créé avec succès.');
    }

    public function edit(PurchaseOrder $purchaseOrder)
    {
        Gate::authorize('update', $purchaseOrder);

        $suppliers = Supplier::where('is_active', true)->get(['id', 'name']);
        $items = Item::where('is_active', true)->select('id', 'name', 'default_unit_id')->get();
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Purchases/PurchaseOrder/Edit', [
            // Eager loading de l'article plutôt que de la catégorie
            'purchaseOrder' => $purchaseOrder->load('items.item', 'supplier'),
            'suppliers'     => $suppliers,
            'items'         => $items,
            'units'         => $units,
        ]);
    }

    public function update(UpdatePurchaseOrderRequest $request, PurchaseOrder $purchaseOrder, UpdatePurchaseOrderAction $action)
    {
        $action->execute($purchaseOrder, $request->validated());
        return redirect('/purchases/purchase-orders')->with('success', 'Bon de commande mis à jour.');
    }

    public function destroy(PurchaseOrder $purchaseOrder, DeletePurchaseOrderAction $action)
    {
        Gate::authorize('delete', $purchaseOrder);
        $action->execute($purchaseOrder);
        return redirect('/purchases/purchase-orders')->with('success', 'Bon de commande supprimé.');
    }

    public function approve(PurchaseOrder $purchaseOrder, ApprovePurchaseOrderAction $action, Request $request)
    {
        Gate::authorize('update', $purchaseOrder); // Ou 'approve' si tu as une politique spécifique

        $action->execute($purchaseOrder, $request->user()->id);

        return redirect('/purchases/purchase-orders')
            ->with('success', 'La commande a été validée avec succès.');
    }

    public function generateReceipt(PurchaseOrder $purchaseOrder, GenerateReceiptFromOrderAction $action)
    {
        Gate::authorize('update', $purchaseOrder);

        $receipt = $action->execute($purchaseOrder, request()->user()->id);

        return redirect('/purchases/purchase-receipts/' . $receipt->id . '/edit')
        ->with('success', 'Bon de réception généré avec succès. Veuillez le vérifier.');
    }

    public function showApi(PurchaseOrder $purchaseOrder)
    {
        Gate::authorize('view', $purchaseOrder);
        // Eager loading ajusté
        return response()->json($purchaseOrder->load(['items.item', 'items.unit']));
    }

    public function downloadPdf(PurchaseOrder $purchaseOrder, GeneratePurchaseOrderPdfAction $action)
    {
        Gate::authorize('view', $purchaseOrder);
        $pdf = $action->execute($purchaseOrder);
        return $pdf->stream($purchaseOrder->reference . '.pdf');
    }
}
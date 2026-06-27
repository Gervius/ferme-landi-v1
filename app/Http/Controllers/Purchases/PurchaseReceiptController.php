<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\Purchases\ApprovePurchaseReceiptAction;
use App\Actions\Purchases\LogPurchaseReceiptAction;
use App\Actions\Exports\GeneratePurchaseReceiptPdfAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchaseReceiptRequest;
use App\Models\Item; // 1. Remplacement de Category par Item
use App\Models\PurchaseOrder;
use App\Models\PurchaseReceipt;
use App\Models\Unit;
use App\Models\Site;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PurchaseReceiptController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', PurchaseReceipt::class);
        $data = PurchaseReceipt::with('purchaseOrder')->paginate(15);
        return Inertia::render('Purchases/PurchaseReceipt/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', PurchaseReceipt::class);

        $purchaseOrders = PurchaseOrder::whereIn('status', ['validated', 'partially_received'])->get(['id', 'reference']);
        
        // 2. Chargement des Articles actifs pour peupler le formulaire
        $items = Item::where('is_active', true)->select('id', 'name', 'default_unit_id')->get();
        
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);
        $sites = Site::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Purchases/PurchaseReceipt/Create', [
            'purchaseOrders' => $purchaseOrders,
            'items'          => $items, // Injection des items
            'units'          => $units,
            'sites'          => $sites,
        ]);
    }

    public function store(StorePurchaseReceiptRequest $request, LogPurchaseReceiptAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        
        // 3. Routage absolu Wayfinder
        return redirect('/purchase-receipts')->with('success', 'Bon de réception créé en brouillon.');
    }

    public function approve(PurchaseReceipt $purchaseReceipt, ApprovePurchaseReceiptAction $action)
    {
        Gate::authorize('manage purchases');
        $action->execute($purchaseReceipt, request()->user()->id);
        
        // 3. Routage absolu Wayfinder
        return redirect('/purchase-receipts')->with('success', 'Bon de réception approuvé et stock mis à jour.');
    }

    public function showApi(PurchaseReceipt $purchaseReceipt)
    {
        Gate::authorize('view', $purchaseReceipt);

        // 4. Correction de l'Eager Loading (items.item au lieu de items.category)
        return response()->json($purchaseReceipt->load(['items.item', 'items.unit']));
    }

    public function downloadPdf(PurchaseReceipt $purchase_receipt, GeneratePurchaseReceiptPdfAction $action)
    {
        Gate::authorize('view', $purchase_receipt);

        $pdf = $action->execute($purchase_receipt);

        return $pdf->stream($purchase_receipt->reference . '.pdf');
    }
}
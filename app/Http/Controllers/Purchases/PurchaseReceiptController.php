<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\Purchases\ApprovePurchaseReceiptAction;
use App\Actions\Purchases\LogPurchaseReceiptAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchaseReceiptRequest;
use App\Models\Category;
use App\Models\PurchaseOrder;
use App\Models\PurchaseReceipt;
use App\Models\Unit;
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
        $categories = Category::all(['id', 'name']);
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Purchases/PurchaseReceipt/Create', [
            'purchaseOrders' => $purchaseOrders,
            'categories'     => $categories,
            'units'          => $units,
        ]);
    }

    public function store(StorePurchaseReceiptRequest $request, LogPurchaseReceiptAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        return redirect()->route('purchaseReceiptsIndex')->with('success', 'Purchase receipt created in draft.');
    }

    public function approve(PurchaseReceipt $purchaseReceipt, ApprovePurchaseReceiptAction $action)
    {
        Gate::authorize('manage purchases');
        $action->execute($purchaseReceipt, request()->user()->id);
        return redirect()->route('purchaseReceiptsIndex')->with('success', 'Purchase receipt approved and stock updated.');
    }
}

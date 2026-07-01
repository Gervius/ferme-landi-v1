<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\Purchases\ApproveSupplierInvoiceAction;
use App\Actions\Purchases\LogSupplierInvoiceAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StoreSupplierInvoiceRequest;
use App\Models\PurchaseReceipt;
use App\Models\Supplier;
use App\Models\SupplierInvoice;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SupplierInvoiceController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', SupplierInvoice::class);
        $data = SupplierInvoice::with(['supplier', 'purchaseReceipt'])->paginate(15);
        return Inertia::render('Purchases/SupplierInvoice/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', SupplierInvoice::class);

        $suppliers = Supplier::where('is_active', true)->get(['id', 'name']);
        $receipts = PurchaseReceipt::where('status', 'approved')->whereDoesntHave('supplierInvoice')->get(['id', 'reference']);

        return Inertia::render('Purchases/SupplierInvoice/Create', [
            'suppliers' => $suppliers,
            'receipts'  => $receipts,
        ]);
    }

    public function store(StoreSupplierInvoiceRequest $request, LogSupplierInvoiceAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        // Routage Wayfinder
        return redirect('/purchases/supplier-invoices')->with('success', 'Facture fournisseur créée en brouillon.');
    }

    public function approve(SupplierInvoice $supplierInvoice, ApproveSupplierInvoiceAction $action)
    {
        Gate::authorize('manage purchases');
        $action->execute($supplierInvoice, request()->user()->id);
        // Routage Wayfinder
        return redirect('/purchases/supplier-invoices')->with('success', 'Facture fournisseur validée (Écriture comptable générée).');
    }
}
<?php

namespace App\Http\Controllers\Purchases;

use App\Actions\Purchases\ApproveSupplierPaymentAction;
use App\Actions\Purchases\LogSupplierPaymentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StoreSupplierPaymentRequest;
use App\Models\Supplier;
use App\Models\SupplierPayment;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SupplierPaymentController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', SupplierPayment::class);
        $data = SupplierPayment::with('supplier')->paginate(15);
        $suppliers = Supplier::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Purchases/SupplierPayment/Index', [
            'data' => $data,
            'suppliers' => $suppliers
        ]);
    }

    public function create()
    {
        Gate::authorize('create', SupplierPayment::class);

        $suppliers = Supplier::where('is_active', true)->get(['id', 'name']);

        // On récupère les factures validées (qui ont généré de la dette)
        // Idéalement, on filtrerait aussi celles qui sont DÉJÀ payées, 
        // mais c'est un bon début.
        $invoices = \App\Models\SupplierInvoice::with('supplier:id,name')
            ->where('status', 'approved') 
            ->select('id', 'supplier_id', 'reference', 'total_amount')
            ->get();

        return Inertia::render('Purchases/SupplierPayment/Create', [
            'suppliers' => $suppliers,
            'pendingInvoices' => $invoices, // Nouvel ajout
        ]);
    }

    public function store(StoreSupplierPaymentRequest $request, LogSupplierPaymentAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        // Routage Wayfinder avec le bon préfixe
        return redirect('/purchases/supplier-payments')->with('success', 'Paiement fournisseur créé en brouillon.');
    }

    public function approve(SupplierPayment $supplierPayment, ApproveSupplierPaymentAction $action)
    {
        Gate::authorize('manage purchases');
        $action->execute($supplierPayment, request()->user()->id);
        // Routage Wayfinder avec le bon préfixe
        return redirect('/purchases/supplier-payments')->with('success', 'Paiement fournisseur approuvé.');
    }
}
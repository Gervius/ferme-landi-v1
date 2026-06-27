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

        return Inertia::render('Purchases/SupplierPayment/Create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(StoreSupplierPaymentRequest $request, LogSupplierPaymentAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        // Routage Wayfinder
        return redirect('/supplier-payments')->with('success', 'Paiement fournisseur créé en brouillon.');
    }

    public function approve(SupplierPayment $supplierPayment, ApproveSupplierPaymentAction $action)
    {
        Gate::authorize('manage purchases');
        $action->execute($supplierPayment, request()->user()->id);
        // Routage Wayfinder
        return redirect('/supplier-payments')->with('success', 'Paiement fournisseur approuvé.');
    }
}
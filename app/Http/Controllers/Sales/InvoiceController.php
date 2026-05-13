<?php

namespace App\Http\Controllers\Sales;

use App\Actions\Sales\ApproveInvoiceAction;
use App\Actions\Sales\LogInvoiceAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreInvoiceRequest;
use App\Models\Invoice;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Invoice::class);
        $data = Invoice::with(['customer', 'deliveryNote'])->paginate(15);
        return Inertia::render('Sales/Invoice/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', Invoice::class);
        return Inertia::render('Sales/Invoice/Create');
    }

    public function store(StoreInvoiceRequest $request, LogInvoiceAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        return redirect()->route('invoicesIndex')->with('success', 'Invoice created in draft.');
    }

    public function approve(Invoice $invoice, ApproveInvoiceAction $action)
    {
        Gate::authorize('manage sales');
        $action->execute($invoice, request()->user()->id);
        return redirect()->route('invoicesIndex')->with('success', 'Invoice approved.');
    }
}

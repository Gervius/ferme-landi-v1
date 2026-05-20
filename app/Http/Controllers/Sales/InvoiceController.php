<?php

namespace App\Http\Controllers\Sales;

use App\Actions\Sales\ApproveInvoiceAction;
use App\Actions\Sales\LogInvoiceAction;
use App\Actions\Exports\GenerateInvoicePdfAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreInvoiceRequest;
use App\Models\Invoice;
use App\Models\Customer;
use App\Models\DeliveryNote;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(): Response
    {
        Gate::authorize("viewAny", Invoice::class);

        $invoices = Invoice::with(["customer", "deliveryNote"])->paginate(15);

        return Inertia::render("Sales/Invoices/Index", [
            "invoices" => $invoices,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize("create", Invoice::class);

        $customers = Customer::where("is_active", true)->get(["id", "name"]);
        $deliveryNotes = DeliveryNote::where("status", "approved")->get(["id", "reference"]);
        $categories = Category::get(["id", "name"]);
        $units = Unit::get(["id", "name", "symbol"]);

        return Inertia::render("Sales/Invoices/Create", [
            "customers" => $customers,
            "deliveryNotes" => $deliveryNotes,
            "categories" => $categories,
            "units" => $units,
        ]);
    }

    public function store(StoreInvoiceRequest $request, LogInvoiceAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route("invoicesIndex")
            ->with("success", "Facture créée avec succès.");
    }

    public function approve(Invoice $invoice, ApproveInvoiceAction $action)
    {
        Gate::authorize("update", $invoice);

        $action->execute($invoice, request()->user()->id);

        return redirect()->route("invoicesIndex")
            ->with("success", "Facture validée avec succès.");
    }

    public function downloadPdf(Invoice $invoice, GenerateInvoicePdfAction $action)
    {
        Gate::authorize("view", $invoice);

        $pdf = $action->execute($invoice);

        return $pdf->stream($invoice->reference . ".pdf");
    }
}

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
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(): Response
    {
        Gate::authorize("viewAny", Invoice::class);

        // Filtrage spatial strict et Zero N+1
        $invoices = Invoice::where('site_id', auth()->user()->current_site_id)
            ->with(["customer", "deliveryNote"])
            ->latest()
            ->paginate(15);

        return Inertia::render("Sales/Invoices/Index", [
            "invoices" => $invoices,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize("create", Invoice::class);
        $siteId = auth()->user()->current_site_id;

        // Scoping Spatial : Uniquement les clients actifs de ce site
        $customers = Customer::where("site_id", $siteId)
            ->where("is_active", true)
            ->get(["id", "name"]);

        // RAM Optimisation : Uniquement les BL approuvés DE CE SITE qui n'ont pas encore de facture
        $deliveryNotes = DeliveryNote::where("site_id", $siteId)
            ->where("status", "approved")
            ->doesntHave('invoice') // Respect de la contrainte unique (1 BL = 1 Facture)
            ->get(["id", "reference"]);

        return Inertia::render("Sales/Invoices/Create", [
            "customers" => $customers,
            "deliveryNotes" => $deliveryNotes,
            // Les catégories et unités ont été retirées. 
            // Le front-end devra utiliser l'API showApi du DeliveryNote pour récupérer les Items.
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
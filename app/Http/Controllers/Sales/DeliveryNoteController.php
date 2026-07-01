<?php

namespace App\Http\Controllers\Sales;

use App\Actions\Sales\ApproveDeliveryNoteAction;
use App\Actions\Sales\LogDeliveryNoteAction;
use App\Actions\Exports\GenerateDeliveryNotePdfAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreDeliveryNoteRequest;
use App\Models\DeliveryNote;
use App\Models\SaleOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryNoteController extends Controller
{
    public function index(): Response
    {
        Gate::authorize("viewAny", DeliveryNote::class);

        // Filtrage spatial strict et Zero N+1
        $deliveryNotes = DeliveryNote::where('site_id', auth()->user()->current_site_id)
            ->with(["saleOrder.customer"])
            ->latest()
            ->paginate(15);

        return Inertia::render("Sales/DeliveryNotes/Index", [
            "deliveryNotes" => $deliveryNotes,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize("create", DeliveryNote::class);
        $siteId = auth()->user()->current_site_id;

        // RAM Optimisation : Uniquement les commandes validées DE CE SITE sans BL
        $saleOrders = SaleOrder::where("site_id", $siteId)
            ->where("status", "validated")
            ->doesntHave('deliveryNote') // Empêche de générer 2 BL pour la même commande
            ->get(["id", "reference"]);

        return Inertia::render("Sales/DeliveryNotes/Create", [
            "saleOrders" => $saleOrders,
            // Les catégories et unités globales ont été retirées.
        ]);
    }

    public function store(StoreDeliveryNoteRequest $request, LogDeliveryNoteAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route("deliveryNotesIndex")
            ->with("success", "Bon de livraison créé avec succès.");
    }

    public function approve(DeliveryNote $delivery_note, ApproveDeliveryNoteAction $action)
    {
        Gate::authorize("update", $delivery_note);

        $action->execute($delivery_note, request()->user()->id);

        return redirect()->route("deliveryNotesIndex")
            ->with("success", "Bon de livraison validé avec succès.");
    }

    public function showApi(DeliveryNote $delivery_note)
    {
        Gate::authorize("view", $delivery_note);

        // Correction de l'inventaire physique : Eager loading de "item" en amont de category et unit
        return response()->json($delivery_note->load([
            "items.item.category", 
            "items.item.defaultUnit"
        ]));
    }

    public function downloadPdf(DeliveryNote $delivery_note, GenerateDeliveryNotePdfAction $action)
    {
        Gate::authorize("view", $delivery_note);

        $pdf = $action->execute($delivery_note);

        return $pdf->stream($delivery_note->reference . ".pdf");
    }
}
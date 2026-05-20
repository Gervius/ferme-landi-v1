<?php

namespace App\Http\Controllers\Sales;

use App\Actions\Sales\ApproveDeliveryNoteAction;
use App\Actions\Sales\LogDeliveryNoteAction;
use App\Actions\Exports\GenerateDeliveryNotePdfAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreDeliveryNoteRequest;
use App\Models\DeliveryNote;
use App\Models\SaleOrder;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryNoteController extends Controller
{
    public function index(): Response
    {
        Gate::authorize("viewAny", DeliveryNote::class);

        $deliveryNotes = DeliveryNote::with(["saleOrder.customer"])->paginate(15);

        return Inertia::render("Sales/DeliveryNotes/Index", [
            "deliveryNotes" => $deliveryNotes,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize("create", DeliveryNote::class);

        $saleOrders = SaleOrder::where("status", "validated")->get(["id", "reference"]);
        $categories = Category::get(["id", "name"]);
        $units = Unit::get(["id", "name", "symbol"]);

        return Inertia::render("Sales/DeliveryNotes/Create", [
            "saleOrders" => $saleOrders,
            "categories" => $categories,
            "units" => $units,
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

        return response()->json($delivery_note->load(["items.category", "items.unit"]));
    }

    public function downloadPdf(DeliveryNote $delivery_note, GenerateDeliveryNotePdfAction $action)
    {
        Gate::authorize("view", $delivery_note);

        $pdf = $action->execute($delivery_note);

        return $pdf->stream($delivery_note->reference . ".pdf");
    }
}

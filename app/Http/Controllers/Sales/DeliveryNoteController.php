<?php

namespace App\Http\Controllers\Sales;

use App\Actions\Sales\ApproveDeliveryNoteAction;
use App\Actions\Sales\LogDeliveryNoteAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreDeliveryNoteRequest;
use App\Models\DeliveryNote;
use App\Models\SaleOrder;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DeliveryNoteController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', DeliveryNote::class);
        $data = DeliveryNote::with('saleOrder.customer')->paginate(15);
        return Inertia::render('Sales/DeliveryNote/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', DeliveryNote::class);

        $saleOrders = SaleOrder::whereIn('status', ['validated', 'partially_delivered'])->get(['id', 'reference']);
        $categories = Category::where('scope', 'sales')->get(['id', 'name']);
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);

        return Inertia::render('Sales/DeliveryNote/Create', [
            'saleOrders' => $saleOrders,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function store(StoreDeliveryNoteRequest $request, LogDeliveryNoteAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        return redirect()->route('deliveryNotesIndex')->with('success', 'Delivery note created in draft.');
    }

    public function approve(DeliveryNote $deliveryNote, ApproveDeliveryNoteAction $action)
    {
        Gate::authorize('manage sales');
        $action->execute($deliveryNote, request()->user()->id);
        return redirect()->route('deliveryNotesIndex')->with('success', 'Delivery note approved and stock updated.');
    }
}

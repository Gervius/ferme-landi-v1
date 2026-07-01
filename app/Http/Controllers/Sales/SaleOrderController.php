<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreSaleOrderRequest;
use App\Http\Requests\Sales\UpdateSaleOrderRequest;
use App\Models\Customer;
use App\Models\SaleOrder;
use App\Models\Item;
use App\Actions\Sales\LogSaleOrderAction;
use App\Actions\Sales\GenerateDeliveryNoteFromOrderAction;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SaleOrderController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', SaleOrder::class);
        
        // Filtrage spatial strict
        $data = SaleOrder::where('site_id', auth()->user()->current_site_id)
            ->with('customer')
            ->latest()
            ->paginate(15);
            
        return Inertia::render('Sales/SaleOrder/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', SaleOrder::class);
        
        $siteId = auth()->user()->current_site_id;

        // Scoping Spatial : On ne charge que les clients actifs de CE site
        // Note : S'il y a des milliers de clients à l'avenir, il faudra retirer ce get() et 
        // faire une recherche asynchrone côté React (Wayfinder).
        $customers = Customer::where('is_active', true)
            ->where('site_id', $siteId)
            ->get(['id', 'name']);
            
        // Inventaire Strict : On charge les entités physiques (Item) avec leurs relations 
        // au lieu d'envoyer des catégories et unités en vrac.
        $items = Item::where('is_active', true)
            ->with(['category:id,name', 'defaultUnit:id,symbol'])
            ->get(['id', 'name', 'category_id', 'default_unit_id']);
            
        return Inertia::render('Sales/SaleOrder/Create', [
            'customers' => $customers,
            'items' => $items, // React utilisera items pour remplir le select
        ]);
    }

    public function store(StoreSaleOrderRequest $request, LogSaleOrderAction $action)
    {
        // On délègue toute la logique lourde et les DB Transactions à notre Action dédiée.
        // Zéro Event/Listener, logique par Action unique respectée.
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('saleOrdersIndex')->with('success', 'Sale order created.');
    }

    public function edit(SaleOrder $saleOrder)
    {
        Gate::authorize('update', $saleOrder);
        
        return Inertia::render('Sales/SaleOrder/Edit', [
            'saleOrder' => $saleOrder->load('items.item', 'customer'), // Eager loading de l'item physique
        ]);
    }

    public function update(UpdateSaleOrderRequest $request, SaleOrder $saleOrder)
    {
        $saleOrder->update($request->validated());
        return redirect()->route('saleOrdersIndex')->with('success', 'Sale order status updated.');
    }

    public function destroy(SaleOrder $saleOrder)
    {
        Gate::authorize('delete', $saleOrder);
        $saleOrder->delete();
        return redirect()->route('saleOrdersIndex')->with('success', 'Sale order deleted.');
    }

    public function generateDeliveryNote(SaleOrder $saleOrder, GenerateDeliveryNoteFromOrderAction $action)
    {
        Gate::authorize('update', $saleOrder);

        $deliveryNote = $action->execute($saleOrder, request()->user()->id);

        return redirect()->route('deliveryNotesEdit', $deliveryNote->id)
            ->with('success', 'Bon de livraison généré avec succès. Veuillez le vérifier.');
    }
}
<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreSaleOrderRequest;
use App\Http\Requests\Sales\UpdateSaleOrderRequest;
use App\Models\Customer;
use App\Models\SaleOrder;
use App\Models\Category;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SaleOrderController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', SaleOrder::class);
        $data = SaleOrder::with('customer')->paginate(15);
        return Inertia::render('Sales/SaleOrder/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', SaleOrder::class);
        $customers = Customer::where('is_active', true)->get(['id', 'name']);
        $categories = Category::where('scope', \App\Enums\CategoryScope::SALES->value)->get(['id', 'name']);
        $units = Unit::where('is_active', true)->get(['id', 'name', 'symbol']);
        return Inertia::render('Sales/SaleOrder/Create', [
            'customers' => $customers,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function store(StoreSaleOrderRequest $request)
    {
        DB::transaction(function () use ($request) {
            $data = $request->validated();
            $order = SaleOrder::create([
                'customer_id' => $data['customer_id'],
                'order_date' => $data['order_date'],
                'reference' => $data['reference'],
                'created_by' => $request->user()->id,
            ]);

            foreach ($data['items'] as $item) {
                $order->items()->create($item);
            }
        });

        return redirect()->route('saleOrdersIndex')->with('success', 'Sale order created.');
    }

    public function edit(SaleOrder $saleOrder)
    {
        Gate::authorize('update', $saleOrder);
        return Inertia::render('Sales/SaleOrder/Edit', [
            'saleOrder' => $saleOrder->load('items', 'customer'),
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
}

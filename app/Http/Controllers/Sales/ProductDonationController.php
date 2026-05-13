<?php

namespace App\Http\Controllers\Sales;

use App\Actions\Sales\ApproveProductDonationAction;
use App\Actions\Sales\LogProductDonationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreProductDonationRequest;
use App\Models\ProductDonation;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProductDonationController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', ProductDonation::class);
        $data = ProductDonation::with('category')->paginate(15);
        return Inertia::render('Sales/ProductDonation/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', ProductDonation::class);
        return Inertia::render('Sales/ProductDonation/Create');
    }

    public function store(StoreProductDonationRequest $request, LogProductDonationAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        return redirect()->route('productDonationsIndex')->with('success', 'Product donation created in draft.');
    }

    public function approve(ProductDonation $productDonation, ApproveProductDonationAction $action)
    {
        Gate::authorize('manage sales');
        $action->execute($productDonation, request()->user()->id);
        return redirect()->route('productDonationsIndex')->with('success', 'Product donation approved and stock updated.');
    }
}

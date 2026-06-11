<?php

namespace App\Http\Controllers\Sales;

use App\Actions\Sales\ApproveCustomerPaymentAction;
use App\Actions\Sales\LogCustomerPaymentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreCustomerPaymentRequest;
use App\Models\CustomerPayment;
use App\Models\Customer;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CustomerPaymentController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', CustomerPayment::class);
        $data = CustomerPayment::with('customer')->paginate(15);
        $customers = \App\Models\Customer::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Sales/CustomerPayment/Index', [
            'data' => $data,
            'customers' => $customers
        ]);
    }

    public function create()
    {
        Gate::authorize('create', CustomerPayment::class);

        $customers = Customer::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Sales/CustomerPayment/Create', [
            'customers' => $customers,
        ]);
    }

    public function store(StoreCustomerPaymentRequest $request, LogCustomerPaymentAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        return redirect()->route('customerPaymentsIndex')->with('success', 'Customer payment created in draft.');
    }

    public function approve(CustomerPayment $customerPayment, ApproveCustomerPaymentAction $action)
    {
        Gate::authorize('manage sales');
        $action->execute($customerPayment, request()->user()->id);
        return redirect()->route('customerPaymentsIndex')->with('success', 'Customer payment approved.');
    }
}

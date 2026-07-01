<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreCustomerRequest;
use App\Http\Requests\Sales\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Customer::class);
        return Inertia::render('Sales/Customer/Index', [
            // On charge tous les clients, sans filtre spatial
            'data' => Customer::latest()->paginate(15), 
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Customer::class);
        return Inertia::render('Sales/Customer/Create');
    }

    public function store(StoreCustomerRequest $request)
    {
        Customer::create($request->validated());
        return redirect()->route('customersIndex')->with('success', 'Customer created.');
    }

    public function edit(Customer $customer)
    {
        Gate::authorize('update', $customer);
        return Inertia::render('Sales/Customer/Edit', ['customer' => $customer]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $customer->update($request->validated());
        return redirect()->route('customersIndex')->with('success', 'Customer updated.');
    }

    public function destroy(Customer $customer)
    {
        Gate::authorize('delete', $customer);
        $customer->delete();
        return redirect()->route('customersIndex')->with('success', 'Customer deleted.');
    }
}

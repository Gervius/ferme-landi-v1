<?php

namespace App\Http\Controllers\HR;

use App\Actions\HR\CreateEmployeeAction;
use App\Actions\HR\DeleteEmployeeAction;
use App\Actions\HR\UpdateEmployeeAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\HR\StoreEmployeeRequest;
use App\Http\Requests\HR\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\Site;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Employee::class);
        $data = Employee::with('site')->paginate(15);
        return Inertia::render('HR/Employee/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', Employee::class);
        $sites = Site::where('is_active', true)->get(['id', 'name']);
        return Inertia::render('HR/Employee/Create', ['sites' => $sites]);
    }

    public function store(StoreEmployeeRequest $request, CreateEmployeeAction $action)
    {
        $action->execute($request->validated());
        return redirect()->route('employeesIndex')->with('success', 'Employee created.');
    }

    public function edit(Employee $employee)
    {
        Gate::authorize('update', $employee);
        $sites = Site::where('is_active', true)->get(['id', 'name']);
        return Inertia::render('HR/Employee/Edit', [
            'employee' => $employee,
            'sites'    => $sites,
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee, UpdateEmployeeAction $action)
    {
        $action->execute($employee, $request->validated());
        return redirect()->route('employeesIndex')->with('success', 'Employee updated.');
    }

    public function destroy(Employee $employee, DeleteEmployeeAction $action)
    {
        Gate::authorize('delete', $employee);
        $action->execute($employee);
        return redirect()->route('employeesIndex')->with('success', 'Employee deleted.');
    }
}

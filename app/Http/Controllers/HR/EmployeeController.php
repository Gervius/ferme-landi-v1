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

final class EmployeeController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Employee::class);
        
        // Eager loading strict limité aux champs nécessaires
        $data = Employee::with(['site:id,name'])->paginate(15);
        
        // Données chargées ici pour le Modal de création/édition
        $sites = Site::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('HR/Employee/Index', [
            'data' => $data,
            'sites' => $sites,
        ]);
    }

    // Les méthodes create() et edit() sont supprimées

    public function store(StoreEmployeeRequest $request, CreateEmployeeAction $action)
    {
        $action->execute($request->validated());
        
        // Wayfinder : Redirection stricte par URI
        return redirect('/hr/employees')->with('success', 'Employé créé.');
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee, UpdateEmployeeAction $action)
    {
        $action->execute($employee, $request->validated());
        
        return redirect('/hr/employees')->with('success', 'Employé mis à jour.');
    }

    public function destroy(Employee $employee, DeleteEmployeeAction $action)
    {
        Gate::authorize('delete', $employee);
        $action->execute($employee);
        
        return redirect('/hr/employees')->with('success', 'Employé supprimé.');
    }
}
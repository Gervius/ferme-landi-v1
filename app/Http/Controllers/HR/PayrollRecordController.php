<?php

namespace App\Http\Controllers\HR;

use App\Actions\HR\ApprovePayrollRecordAction;
use App\Actions\HR\LogPayrollAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\HR\StorePayrollRecordRequest;
use App\Models\Employee;
use App\Models\PayrollRecord;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

final class PayrollRecordController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', PayrollRecord::class);
        
        // Eager loading strict
        $data = PayrollRecord::with(['employee:id,first_name,last_name'])->paginate(15);
        
        // Données pour le Modal de saisie de paie
        $employees = Employee::where('is_active', true)->get(['id', 'first_name', 'last_name']);

        return Inertia::render('HR/PayrollRecord/Index', [
            'data' => $data,
            'employees' => $employees,
        ]);
    }


    public function store(StorePayrollRecordRequest $request, LogPayrollAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        
        // CORRECTION ICI : L'URI exacte de la ressource
        return redirect('/hr/payroll-records')->with('success', 'Fiche de paie enregistrée en brouillon.');
    }

    public function approve(PayrollRecord $payrollRecord, ApprovePayrollRecordAction $action)
    {
        Gate::authorize('manage hr'); 
        
        $action->execute($payrollRecord, request()->user()->id);
        
        // CORRECTION ICI : L'URI exacte de la ressource
        return redirect('/hr/payroll-records')->with('success', 'Paie approuvée et écritures comptables générées.');
    }

    
    
}
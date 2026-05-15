<?php

namespace App\Http\Controllers\HR;

use App\Actions\HR\ApprovePayrollAction;
use App\Actions\HR\LogPayrollAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\HR\StorePayrollRecordRequest;
use App\Models\Employee;
use App\Models\PayrollRecord;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PayrollRecordController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', PayrollRecord::class);
        $data = PayrollRecord::with('employee')->paginate(15);
        return Inertia::render('HR/PayrollRecord/Index', ['data' => $data]);
    }

    public function create()
    {
        Gate::authorize('create', PayrollRecord::class);
        $employees = Employee::where('is_active', true)->get(['id', 'first_name', 'last_name']);
        return Inertia::render('HR/PayrollRecord/Create', ['employees' => $employees]);
    }

    public function store(StorePayrollRecordRequest $request, LogPayrollAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);
        return redirect()->route('payrollRecordsIndex')->with('success', 'Payroll record created in draft.');
    }

    public function approve(PayrollRecord $payrollRecord, ApprovePayrollAction $action)
    {
        Gate::authorize('manage hr'); // Assuming general permission for this specific module
        $action->execute($payrollRecord, request()->user()->id);
        return redirect()->route('payrollRecordsIndex')->with('success', 'Payroll record approved.');
    }
}

<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveProductionAction;
use App\Actions\Zootechnie\LogProductionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreDailyProductionRequest;
use App\Models\DailyProduction;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DailyProductionController extends Controller
{
    public function index()
    {
        $data = DailyProduction::with(['generation', 'unit', 'category'])->paginate(15);

        return Inertia::render('Zootechnie/DailyProduction/Index', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        return Inertia::render('Zootechnie/DailyProduction/Create', [
            // Add reference data here if needed (generations, units)
        ]);
    }

    public function store(StoreDailyProductionRequest $request, LogProductionAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('zootechnie.daily-productions.index')
            ->with('success', 'Production recorded in draft status.');
    }

    public function approve(DailyProduction $dailyProduction, ApproveProductionAction $action)
    {
        // Adjust the ability based on your actual policy or permission name
        Gate::authorize('manage generations'); // Or specific permission

        $action->execute($dailyProduction, request()->user()->id);

        return redirect()->route('zootechnie.daily-productions.index')
            ->with('success', 'Production approved successfully.');
    }
}

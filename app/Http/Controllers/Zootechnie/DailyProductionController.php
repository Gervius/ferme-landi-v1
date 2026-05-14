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
        Gate::authorize('create', DailyProduction::class);

        $generations = \App\Models\Generation::where('status', 'actif')->get(['id', 'code']);
        $categories = \App\Models\Category::where('scope', 'sales')->get(['id', 'name']);

        return Inertia::render('Zootechnie/DailyProduction/Create', [
            'generations' => $generations,
            'categories'  => $categories,
        ]);
    }

    public function store(StoreDailyProductionRequest $request, LogProductionAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('dailyProductionsIndex')
            ->with('success', 'Production recorded in draft status.');
    }

    public function approve(DailyProduction $dailyProduction, ApproveProductionAction $action)
    {
        // Adjust the ability based on your actual policy or permission name
        Gate::authorize('manage generations'); // Or specific permission

        $action->execute($dailyProduction, request()->user()->id);

        return redirect()->route('dailyProductionsIndex')
            ->with('success', 'Production approved successfully.');
    }
}

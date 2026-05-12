<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveFeedConsumptionAction;
use App\Actions\Zootechnie\LogFeedConsumptionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFeedConsumptionRequest;
use App\Models\FeedConsumption;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FeedConsumptionController extends Controller
{
    public function index()
    {
        $data = FeedConsumption::with(['generation', 'unit', 'category'])->paginate(15);

        return Inertia::render('Zootechnie/FeedConsumption/Index', [
            'data' => $data,
        ]);
    }

    public function create()
    {
        return Inertia::render('Zootechnie/FeedConsumption/Create');
    }

    public function store(StoreFeedConsumptionRequest $request, LogFeedConsumptionAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        return redirect()->route('zootechnie.feed-consumptions.index')
            ->with('success', 'Feed consumption recorded in draft status.');
    }

    public function approve(FeedConsumption $feedConsumption, ApproveFeedConsumptionAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($feedConsumption, request()->user()->id);

        return redirect()->route('zootechnie.feed-consumptions.index')
            ->with('success', 'Feed consumption approved successfully.');
    }
}

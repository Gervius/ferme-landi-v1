<?php

namespace App\Http\Controllers\Zootechnie;

use App\Http\Controllers\Controller;
use App\Models\ScheduledTreatment;
use App\Models\Generation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ScheduledTreatmentController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ScheduledTreatment::class);

        $query = ScheduledTreatment::with(['generation', 'step.medicationCategory']);

        if ($request->has('generation_id')) {
            $query->where('generation_id', $request->input('generation_id'));
        }

        $treatments = $query->orderBy('scheduled_date', 'asc')->paginate(20);

        $generations = Generation::where('status', 'actif')->get(['id', 'code', 'type']);

        return Inertia::render('Zootechnie/ScheduledTreatment/Index', [
            'treatments' => $treatments,
            'filters' => $request->only('generation_id'),
            'generations' => $generations,
        ]);
    }

    public function markAsDone(ScheduledTreatment $scheduledTreatment): RedirectResponse
    {
        Gate::authorize('update', $scheduledTreatment);

        DB::transaction(function () use ($scheduledTreatment) {
            $scheduledTreatment->update(['status' => 'completed']);
        });

        return redirect()->back()->with('success', 'Treatment marked as completed.');
    }
}

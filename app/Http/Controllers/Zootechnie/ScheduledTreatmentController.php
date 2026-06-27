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

final class ScheduledTreatmentController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', ScheduledTreatment::class);

        $query = ScheduledTreatment::select([
                'id', 'generation_id', 'prophylaxis_step_id', 'scheduled_date', 'status'
            ])
            ->with([
                'generation:id,code,type',
                'step:id,prophylaxis_program_id,day_offset,alert_days_before',
                'step.medicationCategory:id,name'
            ]);

        if ($request->has('generation_id')) {
            $query->where('generation_id', $request->input('generation_id'));
        }

        $treatments = $query->orderBy('scheduled_date', 'asc')->paginate(20);

        $generations = Generation::where('status', 'actif')
            ->get(['id', 'code', 'type']);

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

        // WAYFINDER STRICT : URI dure (retour à la liste avec les mêmes filtres éventuels)
        return redirect('/zootechnie/scheduled-treatments')
            ->with('success', 'Traitement marqué comme terminé.');
    }
}
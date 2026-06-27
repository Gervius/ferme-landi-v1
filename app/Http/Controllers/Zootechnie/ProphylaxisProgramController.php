<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\SyncProphylaxisForGenerationsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreProphylaxisProgramRequest;
use App\Http\Requests\Zootechnie\UpdateProphylaxisProgramRequest;
use App\Models\Category;
use App\Models\ProphylaxisProgram;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;


final class ProphylaxisProgramController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', ProphylaxisProgram::class);

        // OPTIMISATION RAM : On ne charge de la relation steps que ce qui est utile pour compter (length)
        $programs = ProphylaxisProgram::select(['id', 'name', 'animal_type', 'is_active', 'created_at', 'updated_at'])
            ->with([
                'steps:id,prophylaxis_program_id'
            ])
            ->paginate(15);

        return Inertia::render('Zootechnie/ProphylaxisProgram/Index', [
            'programs' => $programs,
        ]);
    }

    // 🔴 MÉTHODE RÉTABLIE
    public function create(): Response
    {
        Gate::authorize('create', ProphylaxisProgram::class);

        $medicationCategories = Category::where('is_active', true)
            ->where('scope', \App\Enums\CategoryScope::MEDICATION->value)
            ->get(['id', 'name']);

        return Inertia::render('Zootechnie/ProphylaxisProgram/Create', [
            'medicationCategories' => $medicationCategories,
        ]);
    }

    public function store(StoreProphylaxisProgramRequest $request, SyncProphylaxisForGenerationsAction $syncAction): RedirectResponse
    {
        DB::transaction(function () use ($request, $syncAction) {
            $data = $request->validated();

            $program = ProphylaxisProgram::create([
                'name' => $data['name'],
                'animal_type' => $data['animal_type'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (!empty($data['steps'])) {
                $program->steps()->createMany($data['steps']);
            }

            $syncAction->execute($program);
        });

        // WAYFINDER STRICT : URI en dur
        return redirect('/zootechnie/prophylaxis-programs')
            ->with('success', 'Programme créé et appliqué aux lots avec succès.');
    }

    // 🔴 MÉTHODE RÉTABLIE
    public function edit(ProphylaxisProgram $prophylaxisProgram): Response
    {
        Gate::authorize('update', $prophylaxisProgram);

        // On hydrate l'objet avec ses étapes pour le formulaire
        $prophylaxisProgram->load([
            'steps:id,prophylaxis_program_id,day_offset,alert_days_before,medication_category_id,description'
        ]);

        $medicationCategories = Category::where('is_active', true)
            ->where('scope', \App\Enums\CategoryScope::MEDICATION->value)
            ->get(['id', 'name']);

        return Inertia::render('Zootechnie/ProphylaxisProgram/Edit', [
            'program' => $prophylaxisProgram,
            'medicationCategories' => $medicationCategories,
        ]);
    }

    public function update(UpdateProphylaxisProgramRequest $request, ProphylaxisProgram $prophylaxisProgram, SyncProphylaxisForGenerationsAction $syncAction): RedirectResponse
    {
        DB::transaction(function () use ($request, $prophylaxisProgram, $syncAction) {
            $data = $request->validated();

            $prophylaxisProgram->update([
                'name' => $data['name'],
                'animal_type' => $data['animal_type'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $existingStepIds = [];
            if (!empty($data['steps'])) {
                foreach ($data['steps'] as $stepData) {
                    if (isset($stepData['id'])) {
                        $step = $prophylaxisProgram->steps()->find($stepData['id']);
                        if ($step) {
                            $step->update($stepData);
                            $existingStepIds[] = $step->id;
                            continue;
                        }
                    }
                    $newStep = $prophylaxisProgram->steps()->create($stepData);
                    $existingStepIds[] = $newStep->id;
                }
            }

            $prophylaxisProgram->steps()->whereNotIn('id', $existingStepIds)->delete();
            $syncAction->execute($prophylaxisProgram);
        });

        // WAYFINDER STRICT : URI en dur
        return redirect('/zootechnie/prophylaxis-programs')
            ->with('success', 'Programme mis à jour avec succès.');
    }

    public function destroy(ProphylaxisProgram $prophylaxisProgram): RedirectResponse
    {
        Gate::authorize('delete', $prophylaxisProgram);

        $prophylaxisProgram->delete();

        // WAYFINDER STRICT : URI en dur
        return redirect('/zootechnie/prophylaxis-programs')
            ->with('success', 'Programme supprimé avec succès.');
    }
}
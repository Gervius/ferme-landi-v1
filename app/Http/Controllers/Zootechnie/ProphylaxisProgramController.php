<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\SyncProphylaxisForGenerationsAction; // Import du moteur de Synchro
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

class ProphylaxisProgramController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', ProphylaxisProgram::class);

        $programs = ProphylaxisProgram::with('steps.medicationCategory')->paginate(15);

        return Inertia::render('Zootechnie/ProphylaxisProgram/Index', [
            'programs' => $programs,
        ]);
    }

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

            // MAGIE : Applique le programme aux lots créés AVANT le programme
            $syncAction->execute($program);
        });

        return redirect()->route('prophylaxisProgramsIndex')->with('success', 'Programme créé et appliqué aux lots avec succès.');
    }

    public function edit(ProphylaxisProgram $prophylaxisProgram): Response
    {
        Gate::authorize('update', $prophylaxisProgram);

        $prophylaxisProgram->load('steps');
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

            // MISE À JOUR INTELLIGENTE : Fini la "terre brûlée" !
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

            // On ne supprime que les étapes que l'utilisateur a VRAIMENT cliqué pour retirer
            $prophylaxisProgram->steps()->whereNotIn('id', $existingStepIds)->delete();

            // MAGIE : Met à jour les dates des traitements en cours sans casser l'historique !
            $syncAction->execute($prophylaxisProgram);
        });

        return redirect()->route('prophylaxisProgramsIndex')->with('success', 'Programme mis à jour avec succès.');
    }

    public function destroy(ProphylaxisProgram $prophylaxisProgram): RedirectResponse
    {
        Gate::authorize('delete', $prophylaxisProgram);

        $prophylaxisProgram->delete();

        return redirect()->route('prophylaxisProgramsIndex')->with('success', 'Programme supprimé avec succès.');
    }
}
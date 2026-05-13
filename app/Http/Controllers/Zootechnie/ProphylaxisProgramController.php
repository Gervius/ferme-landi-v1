<?php

namespace App\Http\Controllers\Zootechnie;

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
            // Ideally scoped to 'medication' or whatever the business logic dictates
            ->get(['id', 'name']);

        return Inertia::render('Zootechnie/ProphylaxisProgram/Create', [
            'medicationCategories' => $medicationCategories,
        ]);
    }

    public function store(StoreProphylaxisProgramRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $data = $request->validated();

            $program = ProphylaxisProgram::create([
                'name' => $data['name'],
                'animal_type' => $data['animal_type'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (!empty($data['steps'])) {
                $program->steps()->createMany($data['steps']);
            }
        });

        return redirect()->route('prophylaxisProgramsIndex')->with('success', 'Program created successfully.');
    }

    public function edit(ProphylaxisProgram $prophylaxisProgram): Response
    {
        Gate::authorize('update', $prophylaxisProgram);

        $prophylaxisProgram->load('steps');
        $medicationCategories = Category::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Zootechnie/ProphylaxisProgram/Edit', [
            'program' => $prophylaxisProgram,
            'medicationCategories' => $medicationCategories,
        ]);
    }

    public function update(UpdateProphylaxisProgramRequest $request, ProphylaxisProgram $prophylaxisProgram): RedirectResponse
    {
        DB::transaction(function () use ($request, $prophylaxisProgram) {
            $data = $request->validated();

            $prophylaxisProgram->update([
                'name' => $data['name'],
                'animal_type' => $data['animal_type'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            // Sync steps
            $prophylaxisProgram->steps()->delete(); // simplified replace strategy
            if (!empty($data['steps'])) {
                $prophylaxisProgram->steps()->createMany($data['steps']);
            }
        });

        return redirect()->route('prophylaxisProgramsIndex')->with('success', 'Program updated successfully.');
    }

    public function destroy(ProphylaxisProgram $prophylaxisProgram): RedirectResponse
    {
        Gate::authorize('delete', $prophylaxisProgram);

        $prophylaxisProgram->delete();

        return redirect()->route('prophylaxisProgramsIndex')->with('success', 'Program deleted successfully.');
    }
}

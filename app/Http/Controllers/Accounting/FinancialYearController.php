<?php

namespace App\Http\Controllers\Accounting;

use App\Actions\Accounting\CloseFinancialYearAction;
use App\Actions\Accounting\CreateFinancialYearAction;
use App\Actions\Accounting\DeleteFinancialYearAction;
use App\Actions\Accounting\UpdateFinancialYearAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreFinancialYearRequest;
use App\Http\Requests\Accounting\UpdateFinancialYearRequest;
use App\Models\FinancialYear;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FinancialYearController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', FinancialYear::class);

        // CORRECTION : On utilise la pagination pour la performance !
        $financialYears = FinancialYear::orderByDesc('year')->paginate(15);

        return Inertia::render('Accounting/FinancialYears/Index', [
            'financialYears' => $financialYears,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', FinancialYear::class);

        return Inertia::render('Accounting/FinancialYears/Create');
    }

    public function store(StoreFinancialYearRequest $request, CreateFinancialYearAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('financialYearsIndex')
            ->with('success', 'Exercice comptable créé avec succès.');
    }

    public function edit(FinancialYear $financialYear): Response
    {
        Gate::authorize('update', $financialYear);

        return Inertia::render('Accounting/FinancialYears/Edit', [
            'financialYear' => $financialYear,
        ]);
    }

    public function update(UpdateFinancialYearRequest $request, FinancialYear $financialYear, UpdateFinancialYearAction $action): RedirectResponse
    {
        $action->execute($financialYear, $request->validated());

        return redirect()->route('financialYearsIndex')
            ->with('success', 'Exercice comptable mis à jour avec succès.');
    }

    public function destroy(FinancialYear $financialYear, DeleteFinancialYearAction $action): RedirectResponse
    {
        Gate::authorize('delete', $financialYear);

        $action->execute($financialYear);

        return redirect()->route('financialYearsIndex')
            ->with('success', 'Exercice comptable supprimé avec succès.');
    }

    public function close(FinancialYear $financialYear, CloseFinancialYearAction $action): RedirectResponse
    {
        Gate::authorize('update', $financialYear);

        $action->execute($financialYear);

        return redirect()->route('financialYearsIndex')
            ->with('success', 'Exercice comptable clôturé avec succès.');
    }
}

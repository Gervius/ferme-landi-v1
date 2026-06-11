<?php

namespace App\Http\Controllers\Accounting;

use App\Actions\Accounting\CreateAnalyticalCodeAction;
use App\Actions\Accounting\DeleteAnalyticalCodeAction;
use App\Actions\Accounting\UpdateAnalyticalCodeAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreAnalyticalCodeRequest;
use App\Http\Requests\Accounting\UpdateAnalyticalCodeRequest;
use App\Models\AnalyticalCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticalCodeController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', AnalyticalCode::class);

        // CORRECTION : On utilise la pagination
        $analyticalCodes = AnalyticalCode::orderBy('code')->paginate(15);

        return Inertia::render('Accounting/AnalyticalCodes/Index', [
            'analyticalCodes' => $analyticalCodes,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', AnalyticalCode::class);

        return Inertia::render('Accounting/AnalyticalCodes/Create');
    }

    public function store(StoreAnalyticalCodeRequest $request, CreateAnalyticalCodeAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('analyticalCodesIndex')
            ->with('success', 'Code analytique créé avec succès.');
    }

    public function edit(AnalyticalCode $analyticalCode): Response
    {
        Gate::authorize('update', $analyticalCode);

        return Inertia::render('Accounting/AnalyticalCodes/Edit', [
            'analyticalCode' => $analyticalCode,
        ]);
    }

    public function update(UpdateAnalyticalCodeRequest $request, AnalyticalCode $analyticalCode, UpdateAnalyticalCodeAction $action): RedirectResponse
    {
        $action->execute($analyticalCode, $request->validated());

        return redirect()->route('analyticalCodesIndex')
            ->with('success', 'Code analytique mis à jour avec succès.');
    }

    public function destroy(AnalyticalCode $analyticalCode, DeleteAnalyticalCodeAction $action): RedirectResponse
    {
        Gate::authorize('delete', $analyticalCode);

        $action->execute($analyticalCode);

        return redirect()->route('analyticalCodesIndex')
            ->with('success', 'Code analytique supprimé avec succès.');
    }
}

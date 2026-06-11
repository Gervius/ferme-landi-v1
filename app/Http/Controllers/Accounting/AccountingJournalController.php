<?php

namespace App\Http\Controllers\Accounting;

use App\Actions\Accounting\CreateAccountingJournalAction;
use App\Actions\Accounting\DeleteAccountingJournalAction;
use App\Actions\Accounting\UpdateAccountingJournalAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreAccountingJournalRequest;
use App\Http\Requests\Accounting\UpdateAccountingJournalRequest;
use App\Models\AccountingJournal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AccountingJournalController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', AccountingJournal::class);

        $accountingJournals = AccountingJournal::orderBy('code')->paginate(15);

        return Inertia::render('Accounting/AccountingJournals/Index', [
            'accountingJournals' => $accountingJournals,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', AccountingJournal::class);

        return Inertia::render('Accounting/AccountingJournals/Create');
    }

    public function store(StoreAccountingJournalRequest $request, CreateAccountingJournalAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('accountingJournalsIndex')
            ->with('success', 'Journal comptable créé avec succès.');
    }

    public function edit(AccountingJournal $accountingJournal): Response
    {
        Gate::authorize('update', $accountingJournal);

        return Inertia::render('Accounting/AccountingJournals/Edit', [
            'accountingJournal' => $accountingJournal,
        ]);
    }

    public function update(UpdateAccountingJournalRequest $request, AccountingJournal $accountingJournal, UpdateAccountingJournalAction $action): RedirectResponse
    {
        $action->execute($accountingJournal, $request->validated());

        return redirect()->route('accountingJournalsIndex')
            ->with('success', 'Journal comptable mis à jour avec succès.');
    }

    public function destroy(AccountingJournal $accountingJournal, DeleteAccountingJournalAction $action): RedirectResponse
    {
        Gate::authorize('delete', $accountingJournal);

        $action->execute($accountingJournal);

        return redirect()->route('accountingJournalsIndex')
            ->with('success', 'Journal comptable supprimé avec succès.');
    }
}

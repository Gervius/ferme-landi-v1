<?php

namespace App\Http\Controllers\Accounting;

use App\Actions\Accounting\ApproveAccountingEntryAction;
use App\Actions\Accounting\DeleteAccountingEntryAction;
use App\Actions\Accounting\LogAccountingEntryAction;
use App\Actions\Accounting\UpdateAccountingEntryAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreAccountingEntryRequest;
use App\Http\Requests\Accounting\UpdateAccountingEntryRequest;
use App\Models\Account;
use App\Models\AccountingEntry;
use App\Models\AccountingJournal;
use App\Models\AnalyticalCenter;
use App\Models\FinancialYear;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AccountingEntryController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', AccountingEntry::class);

        // CORRECTION ICI : paginate(15) au lieu de get()
        $accountingEntries = AccountingEntry::with(['financialYear', 'accountingJournal'])
            ->orderByDesc('date')
            ->paginate(15);

        return Inertia::render('Accounting/AccountingEntries/Index', [
            'accountingEntries' => $accountingEntries,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', AccountingEntry::class);

        $financialYears = FinancialYear::select('id', 'year', 'start_date', 'end_date')
            ->where('is_closed', false)
            ->get();

        $journals = AccountingJournal::select('id', 'code', 'name')
            ->where('is_active', true)
            ->get();

        $accounts = Account::select('id', 'number', 'name')
            ->where('is_active', true)
            ->get();

        $centers = AnalyticalCenter::select('id', 'short_name', 'name')
            ->where('is_active', true)
            ->get();

        return Inertia::render('Accounting/AccountingEntries/Create', [
            'financialYears' => $financialYears,
            'journals' => $journals,
            'accounts' => $accounts,
            'centers' => $centers,
        ]);
    }

    public function store(StoreAccountingEntryRequest $request, LogAccountingEntryAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('accountingEntriesIndex')
            ->with('success', 'Écriture comptable saisie avec succès.');
    }

    public function edit(AccountingEntry $accountingEntry): Response
    {
        Gate::authorize('update', $accountingEntry);

        $accountingEntry->load('lines');

        $financialYears = FinancialYear::select('id', 'year', 'start_date', 'end_date')
            ->where('is_closed', false)
            ->get();

        $journals = AccountingJournal::select('id', 'code', 'name')
            ->where('is_active', true)
            ->get();

        $accounts = Account::select('id', 'number', 'name')
            ->where('is_active', true)
            ->get();

        $centers = AnalyticalCenter::select('id', 'short_name', 'name')
            ->where('is_active', true)
            ->get();

        return Inertia::render('Accounting/AccountingEntries/Edit', [
            'accountingEntry' => $accountingEntry,
            'financialYears' => $financialYears,
            'journals' => $journals,
            'accounts' => $accounts,
            'centers' => $centers,
        ]);
    }

    public function update(UpdateAccountingEntryRequest $request, AccountingEntry $accountingEntry, UpdateAccountingEntryAction $action): RedirectResponse
    {
        $action->execute($accountingEntry, $request->validated());

        return redirect()->route('accountingEntriesIndex')
            ->with('success', 'Écriture comptable mise à jour avec succès.');
    }

    public function destroy(AccountingEntry $accountingEntry, DeleteAccountingEntryAction $action): RedirectResponse
    {
        Gate::authorize('delete', $accountingEntry);

        $action->execute($accountingEntry);

        return redirect()->route('accountingEntriesIndex')
            ->with('success', 'Écriture comptable supprimée avec succès.');
    }

    public function approve(AccountingEntry $accountingEntry, ApproveAccountingEntryAction $action): RedirectResponse
    {
        Gate::authorize('update', $accountingEntry);

        $action->execute($accountingEntry);

        return redirect()->route('accountingEntriesIndex')
            ->with('success', 'Écriture comptable validée avec succès.');
    }
}

<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\AccountingJournal;
use App\Models\AccountingMapping;
use App\Models\AnalyticalNature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AccountingMappingController extends Controller
{
    public function index(): Response
    {
        // Pense à créer la permission 'viewAny' dans tes policies si tu utilises Gate
        // Gate::authorize('viewAny', AccountingMapping::class);

        // Chargement Eager Loading strict pour éviter le N+1 sur l'affichage de la liste
        $mappings = AccountingMapping::with([
            'journal:id,code,name',
            'debitAccount:id,number,name',
            'creditAccount:id,number,name',
            'analyticalNature:id,code,name'
        ])
        ->orderBy('event_type')
        ->paginate(15);

        return Inertia::render('Accounting/AccountingMappings/Index', [
            'mappings' => $mappings,
        ]);
    }

    public function create(): Response
    {
        // Gate::authorize('create', AccountingMapping::class);

        return Inertia::render('Accounting/AccountingMappings/Create', [
            'journals' => AccountingJournal::select('id', 'code', 'name')->where('is_active', true)->get(),
            'accounts' => Account::select('id', 'number', 'name')->where('is_active', true)->get(),
            'natures' => AnalyticalNature::select('id', 'code', 'name')->where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Gate::authorize('create', AccountingMapping::class);

        $validated = $request->validate([
            'event_type' => ['required', 'string', 'unique:accounting_mappings,event_type'],
            'name' => ['required', 'string', 'max:255'],
            'accounting_journal_id' => ['required', 'exists:accounting_journals,id'],
            'debit_account_id' => ['required', 'exists:accounts,id'],
            'credit_account_id' => ['required', 'exists:accounts,id'],
            'analytical_nature_id' => ['nullable', 'exists:analytical_natures,id'],
        ]);

        AccountingMapping::create($validated);

        return redirect()->to('/accounting/accounting-mappings')
            ->with('success', 'Le paramétrage comptable a été créé avec succès.');
    }
}
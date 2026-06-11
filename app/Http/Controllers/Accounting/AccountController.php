<?php

namespace App\Http\Controllers\Accounting;

use App\Actions\Accounting\CreateAccountAction;
use App\Actions\Accounting\DeleteAccountAction;
use App\Actions\Accounting\UpdateAccountAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreAccountRequest;
use App\Http\Requests\Accounting\UpdateAccountRequest;
use App\Models\Account;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Account::class);

        $accounts = Account::orderBy('number')->paginate(15); 

        return Inertia::render('Accounting/Accounts/Index', [
            'accounts' => $accounts,
        ]);
    }
    

    public function create(): Response
    {
        Gate::authorize('create', Account::class);

        return Inertia::render('Accounting/Accounts/Create');
    }

    public function store(StoreAccountRequest $request, CreateAccountAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('accountsIndex')
            ->with('success', 'Compte créé avec succès.');
    }

    public function edit(Account $account): Response
    {
        Gate::authorize('update', $account);

        return Inertia::render('Accounting/Accounts/Edit', [
            'account' => $account,
        ]);
    }

    public function update(UpdateAccountRequest $request, Account $account, UpdateAccountAction $action): RedirectResponse
    {
        $action->execute($account, $request->validated());

        return redirect()->route('accountsIndex')
            ->with('success', 'Compte mis à jour avec succès.');
    }

    public function destroy(Account $account, DeleteAccountAction $action): RedirectResponse
    {
        Gate::authorize('delete', $account);

        $action->execute($account);

        return redirect()->route('accountsIndex')
            ->with('success', 'Compte supprimé avec succès.');
    }
}

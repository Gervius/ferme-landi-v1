<?php

namespace App\Http\Controllers;

use App\Actions\Logistics\CreateSiteAction;
use App\Http\Requests\Logistics\StoreSiteRequest;
use App\Http\Requests\Logistics\UpdateSiteRequest;
use App\Models\Company;
use App\Models\Site;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Site::class);

        $sites = Site::with('company')->paginate(10);

        return Inertia::render('Sites/Index', [
            'sites' => $sites,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create', Site::class);

        $companies = Company::select('id', 'name')->get();

        return Inertia::render('Sites/Create', [
            'companies' => $companies,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSiteRequest $request, CreateSiteAction $createSiteAction): RedirectResponse
    {
        // Authorization is handled in StoreSiteRequest.

        $createSiteAction->execute($request->validated());

        return redirect()->route('sites.index')->with('success', 'Site created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Site $site): Response
    {
        Gate::authorize('update', $site);

        $site->load('company');
        $companies = Company::select('id', 'name')->get();

        return Inertia::render('Sites/Edit', [
            'site' => $site,
            'companies' => $companies,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSiteRequest $request, Site $site): RedirectResponse
    {
        // Authorization is handled in UpdateSiteRequest.

        $site->update($request->validated());

        return redirect()->route('sites.index')->with('success', 'Site updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Site $site): RedirectResponse
    {
        Gate::authorize('delete', $site);

        $site->delete();

        return redirect()->route('sites.index')->with('success', 'Site deleted successfully.');
    }
}

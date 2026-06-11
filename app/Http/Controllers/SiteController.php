<?php

namespace App\Http\Controllers;

use App\Actions\Logistics\CreateSiteAction;
use App\Http\Requests\Logistics\StoreSiteRequest;
use App\Http\Requests\Logistics\UpdateSiteRequest;
use App\Models\Company;
use App\Models\Site;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use App\Enums\SiteType;
use Inertia\Inertia;
use Inertia\Response;

final class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Site::class);

        $sites = Site::select(['id', 'company_id', 'name', 'code', 'type', 'is_active'])
            ->with(['company:id,name'])
            ->paginate(10);

        $companies = Company::select(['id', 'name'])->get();

        // Extraction dynamique des types depuis l'Enum (s'exécute directement dans la RAM du serveur)
        $siteTypes = array_map(fn($type) => [
            'value' => $type->value,
            'label' => $type->label()
        ], SiteType::cases());

        return Inertia::render('Sites/Index', [
            'sites'     => $sites,
            'companies' => $companies,
            'siteTypes' => $siteTypes, // On passe les types au Front
        ]);
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSiteRequest $request, CreateSiteAction $createSiteAction): RedirectResponse
    {
        // Authorization is handled in StoreSiteRequest.

        $createSiteAction->execute($request->validated());

        return redirect()->route('sitesIndex')->with('success', 'Site created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Site $site): Response
    {
        Gate::authorize('update', $site);

        $site->load('company');
        $companies = Company::where('is_active', true)->select('id', 'name')->get();

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

        return redirect()->route('sitesIndex')->with('success', 'Site updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Site $site): RedirectResponse
    {
        Gate::authorize('delete', $site);

        $site->delete();

        return redirect()->route('sitesIndex')->with('success', 'Site deleted successfully.');
    }
}

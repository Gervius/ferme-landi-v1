<?php

namespace App\Http\Controllers;

use App\Actions\Logistics\CreateCategoryAction;
use App\Actions\Logistics\UpdateCategoryAction;
use App\Http\Requests\Logistics\StoreCategoryRequest; // J'utilise tes Requests dédiées
use App\Http\Requests\Logistics\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

final class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Category::class);

        // Sélection stricte des colonnes + eager loading restreint pour l'index
        $query = Category::select(['id', 'parent_id', 'name', 'slug', 'scope', 'is_active'])
            ->with(['parent:id,name']);

        if ($request->has('scope')) {
            $query->where('scope', $request->input('scope'));
        }

        $categories = $query->paginate(10);

        // Extraction légère des couples ID/Name/Scope pour l'UI
        $parents = Category::select(['id', 'name', 'scope'])
            ->where('is_active', true)
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters'    => $request->only('scope'),
            'parents'    => $parents,
        ]);
    }

    public function store(StoreCategoryRequest $request, CreateCategoryAction $createAction): RedirectResponse
    {
        $createAction->execute($request->validated());
        
        // Routage Wayfinder strict
        return redirect('/categories')->with('success', 'Catégorie créée avec succès.');
    }

    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategoryAction $updateAction): RedirectResponse
    {
        Gate::authorize('update', $category);

        $updateAction->execute($category, $request->validated());
        
        // Routage Wayfinder strict
        return redirect('/categories')->with('success', 'Catégorie mise à jour avec succès.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        Gate::authorize('delete', $category);
        $category->delete();
        
        return redirect('/categories')->with('success', 'Catégorie supprimée avec succès.');
    }
}
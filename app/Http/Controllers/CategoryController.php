<?php

namespace App\Http\Controllers;

use App\Actions\Logistics\CreateCategoryAction;
use App\Actions\Logistics\UpdateCategoryAction;
use App\Http\Requests\Logistics\StoreCategoryRequest;
use App\Http\Requests\Logistics\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Category::class);

        $query = Category::with('parent');

        if ($request->has('scope')) {
            $query->where('scope', $request->input('scope'));
        }

        $categories = $query->paginate(10);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only('scope'),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Category::class);
        $parents = Category::all();

        return Inertia::render('Categories/Create', [
            'parents' => $parents,
        ]);
    }

    public function store(StoreCategoryRequest $request, CreateCategoryAction $createAction): RedirectResponse
    {
        $createAction->execute($request->validated());
        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function edit(Category $category): Response
    {
        Gate::authorize('update', $category);
        $parents = Category::where('id', '!=', $category->id)->get();

        return Inertia::render('Categories/Edit', [
            'category' => $category,
            'parents' => $parents,
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategoryAction $updateAction): RedirectResponse
    {
        $updateAction->execute($category, $request->validated());
        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        Gate::authorize('delete', $category);
        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
    }
}

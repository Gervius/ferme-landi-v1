<?php

namespace App\Http\Controllers\Logistics;

use App\Actions\Logistics\CreateItemAction;
use App\Actions\Logistics\UpdateItemAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Logistics\StoreItemRequest;
use App\Http\Requests\Logistics\UpdateItemRequest;
use App\Models\Category;
use App\Models\Item;
use App\Models\Unit;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Item::class);
        
        // Eager loading restreint pour soulager la RAM du VPS
        $items = Item::with(['category:id,name,scope', 'defaultUnit:id,name,symbol'])
            ->paginate(15);
            
        return Inertia::render('Items/ItemsIndex', ['items' => $items]);
    }

    public function create()
    {
        Gate::authorize('create', Item::class);
        
        // On ne charge que les catégories terminales actives
        $categories = Category::where('is_active', true)->select('id', 'name')->get();
        $units = Unit::where('is_active', true)->select('id', 'name', 'symbol')->get();

        return Inertia::render('Items/ItemsCreate', [
            'categories' => $categories,
            'units'      => $units,
        ]);
    }

    public function store(StoreItemRequest $request, CreateItemAction $action)
    {
        $action->execute($request->validated());
        
        // Routage Wayfinder
        return redirect('/items')->with('success', 'Article créé avec succès.');
    }

    public function edit(Item $item)
    {
        Gate::authorize('update', $item);
        
        $categories = Category::where('is_active', true)->select('id', 'name')->get();
        $units = Unit::where('is_active', true)->select('id', 'name', 'symbol')->get();

        return Inertia::render('Items/ItemsEdit', [
            'item'       => $item,
            'categories' => $categories,
            'units'      => $units,
        ]);
    }

    public function update(UpdateItemRequest $request, Item $item, UpdateItemAction $action)
    {
        $action->execute($item, $request->validated());
        
        return redirect('/items')->with('success', 'Article mis à jour avec succès.');
    }

    public function destroy(Item $item)
    {
        Gate::authorize('delete', $item);
        
        // Le SoftDelete est géré automatiquement par le modèle
        $item->delete();
        
        return redirect('/items')->with('success', 'Article supprimé.');
    }
}
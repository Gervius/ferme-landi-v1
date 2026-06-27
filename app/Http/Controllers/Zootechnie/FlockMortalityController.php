<?php

namespace App\Http\Controllers\Zootechnie;

use App\Actions\Zootechnie\ApproveMortalityAction;
use App\Actions\Zootechnie\LogMortalityAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Zootechnie\StoreFlockMortalityRequest;
use App\Models\FlockMortality;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

final class FlockMortalityController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', FlockMortality::class);

        // OPTIMISATION : select() sur les colonnes utiles
        $data = FlockMortality::select([
                'id', 'generation_id', 'date', 'quantity', 'cause',
                'estimated_financial_loss', 'status', 'prepared_by',
                'approved_by', 'approved_at'
            ])
            ->with(['generation:id,code,type,current_quantity'])
            ->paginate(15);

        $generations = \App\Models\Generation::where('status', 'actif')
            ->get(['id', 'code', 'type', 'current_quantity']);

        return Inertia::render('Zootechnie/FlockMortality/Index', [
            'data' => $data,
            'generations' => $generations,
        ]);
    }

    public function store(StoreFlockMortalityRequest $request, LogMortalityAction $action)
    {
        $action->execute($request->validated(), $request->user()->id);

        // WAYFINDER : URI dure
        return redirect('/zootechnie/flock-mortalities')
            ->with('success', 'Mortalité enregistrée en brouillon.');
    }

    public function approve(Request $request, FlockMortality $flockMortality, ApproveMortalityAction $action)
    {
        Gate::authorize('manage generations');

        $action->execute($flockMortality, $request->user()->id);

        // WAYFINDER : URI dure
        return redirect('/zootechnie/flock-mortalities')
            ->with('success', 'Mortalité validée et cheptel mis à jour.');
    }
}
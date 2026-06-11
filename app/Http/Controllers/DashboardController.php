<?php

namespace App\Http\Controllers;

use App\Enums\CategoryScope;
use App\Models\Account;
use App\Models\AccountingEntry;
use App\Models\AccountingEntryLine;
use App\Models\DailyProduction;
use App\Models\FlockMortality;
use App\Models\StockBalance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // ---------------------------------------------------------
        // A. MÉTÉO DES STOCKS (Alertes critiques Aliment/Santé)
        // ---------------------------------------------------------
        $stockAlerts = StockBalance::with(['category', 'unit'])
            ->whereHas('category', function ($query) {
                // Utilisation stricte de l'Enum CategoryScope
                $query->whereIn('scope', [
                    CategoryScope::FEED->value,
                    CategoryScope::MEDICATION->value,
                ]);
            })
            ->orderBy('quantity', 'asc')
            ->take(5)
            ->get()
            ->map(function ($balance) {
                return [
                    'name' => $balance->category->name ?? 'Inconnu',
                    'symbol' => $balance->unit->symbol ?? '',
                    'quantity' => (float) $balance->quantity,
                ];
            });

        // ---------------------------------------------------------
        // B. PERFORMANCES ZOOTECHNIQUES (7 derniers jours)
        // ---------------------------------------------------------
        $startDate = now()->subDays(6)->startOfDay();
        $endDate = now()->endOfDay();

        // Total des œufs (utilisation de total_base_quantity)
        $productions = DailyProduction::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('DATE(date) as formatted_date, SUM(total_base_quantity) as total_eggs')
            ->groupBy('formatted_date')
            ->pluck('total_eggs', 'formatted_date');

        // Total des mortalités
        $mortalities = FlockMortality::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('DATE(date) as formatted_date, SUM(quantity) as total_mortality')
            ->groupBy('formatted_date')
            ->pluck('total_mortality', 'formatted_date');

        $zootechnieStats = [];
        for ($i = 0; $i < 7; $i++) {
            $currentDate = now()->subDays(6 - $i);
            $dateKey = $currentDate->format('Y-m-d');
            
            $zootechnieStats[] = [
                'date' => $currentDate->format('d/m'),
                'eggs' => (float) ($productions[$dateKey] ?? 0),
                'mortality' => (int) ($mortalities[$dateKey] ?? 0),
            ];
        }

        // ---------------------------------------------------------
        // C. SANTÉ FINANCIÈRE (Mois en cours - écritures validées)
        // ---------------------------------------------------------
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        // Requête de base pour les lignes d'écritures du mois et validées
        $baseEntryLineQuery = AccountingEntryLine::whereHas('accountingEntry', function ($q) use ($startOfMonth, $endOfMonth) {
            $q->whereBetween('date', [$startOfMonth, $endOfMonth])
              ->where('status', AccountingEntry::STATUS_VALIDATED);
        });

        // 1. Revenus (Ventes)
        $revenues = (clone $baseEntryLineQuery)
            ->whereHas('account', fn($q) => $q->where('number', Account::CODE_SALES))
            ->sum('credit');

        // 2. Dépenses Matérielles (Matières premières et Santé regroupées dans CODE_PURCHASES)
        $materialExpenses = (clone $baseEntryLineQuery)
            ->whereHas('account', fn($q) => $q->where('number', Account::CODE_PURCHASES))
            ->sum('debit');

        // 3. Dépenses Salariales
        $payrollExpenses = (clone $baseEntryLineQuery)
            ->whereHas('account', fn($q) => $q->where('number', Account::CODE_SALARIES_EXPENSE))
            ->sum('debit');

        $financialStats = [
            'revenues' => (float) $revenues,
            'material_expenses' => (float) $materialExpenses,
            'payroll_expenses' => (float) $payrollExpenses,
        ];

        // ---------------------------------------------------------
        // ENVOI DU PAYLOAD INERTIA (Le Front-end prend le relais)
        // ---------------------------------------------------------
        return Inertia::render('dashboard', [
            'stockAlerts' => $stockAlerts,
            'zootechnieStats' => $zootechnieStats,
            'financialStats' => $financialStats,
        ]);
    }
}
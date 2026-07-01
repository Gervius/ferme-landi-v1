<?php

namespace App\Http\Controllers;

use App\Enums\CategoryScope;
use App\Models\AccountingEntry;
use App\Models\AccountingEntryLine;
use App\Models\AccountingMapping;
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
        $stockAlerts = StockBalance::with([
                'item:id,category_id,name',
                'item.category:id,scope',
                'unit:id,symbol'
            ])
            ->whereHas('item.category', function ($query) {
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
                    'name' => $balance->item->name ?? 'Inconnu',
                    'symbol' => $balance->unit->symbol ?? '',
                    'quantity' => (int) $balance->quantity, // Typage strict entier
                ];
            });

        // ---------------------------------------------------------
        // B. PERFORMANCES ZOOTECHNIQUES (7 derniers jours)
        // ---------------------------------------------------------
        $startDate = now()->subDays(6)->startOfDay();
        $endDate = now()->endOfDay();

        $productions = DailyProduction::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('DATE(date) as formatted_date, SUM(total_base_quantity) as total_eggs')
            ->groupBy('formatted_date')
            ->pluck('total_eggs', 'formatted_date');

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
                'eggs' => (int) ($productions[$dateKey] ?? 0),
                'mortality' => (int) ($mortalities[$dateKey] ?? 0),
            ];
        }

        // ---------------------------------------------------------
        // C. SANTÉ FINANCIÈRE (Mois en cours - écritures validées)
        // ---------------------------------------------------------
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        // 1. Récupération dynamique des comptes via le paramétrage
        $salesMapping = AccountingMapping::where('event_type', 'customer_invoice')->first();
        $purchasesMapping = AccountingMapping::where('event_type', 'supplier_invoice')->first();
        $payrollMapping = AccountingMapping::where('event_type', 'payroll')->first();

        // Requête de base
        $baseEntryLineQuery = AccountingEntryLine::whereHas('accountingEntry', function ($q) use ($startOfMonth, $endOfMonth) {
            $q->whereBetween('date', [$startOfMonth, $endOfMonth])
              ->where('status', AccountingEntry::STATUS_VALIDATED);
        });

        // 2. Calculs conditionnés à l'existence du mapping
        $revenues = $salesMapping ? (clone $baseEntryLineQuery)
            ->where('account_id', $salesMapping->credit_account_id)
            ->sum('credit') : 0;

        $materialExpenses = $purchasesMapping ? (clone $baseEntryLineQuery)
            ->where('account_id', $purchasesMapping->debit_account_id)
            ->sum('debit') : 0;

        $payrollExpenses = $payrollMapping ? (clone $baseEntryLineQuery)
            ->where('account_id', $payrollMapping->debit_account_id)
            ->sum('debit') : 0;

        // Cast strict en entiers pour les FCFA
        $financialStats = [
            'revenues' => (int) $revenues,
            'material_expenses' => (int) $materialExpenses,
            'payroll_expenses' => (int) $payrollExpenses,
        ];

        // ---------------------------------------------------------
        // ENVOI DU PAYLOAD INERTIA
        // ---------------------------------------------------------
        return Inertia::render('dashboard', [
            'stockAlerts' => $stockAlerts,
            'zootechnieStats' => $zootechnieStats,
            'financialStats' => $financialStats,
        ]);
    }
}
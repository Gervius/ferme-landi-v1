<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\AccountingEntryLine;
use App\Models\DailyProduction;
use App\Models\FinancialYear;
use App\Models\FlockMortality;
use App\Models\StockBalance;
use App\Enums\CategoryScope;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Météo des Stocks (Top 5 lowest quantities for FEED and MEDICATION)
        $stockAlerts = StockBalance::with(['category', 'unit'])
            ->whereHas('category', function ($query) {
                $query->whereIn('scope', [CategoryScope::FEED->value, CategoryScope::MEDICATION->value]);
            })
            ->orderBy('quantity', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($balance) {
                return [
                    'name' => $balance->category->name ?? 'N/A',
                    'symbol' => $balance->unit->symbol ?? '',
                    'quantity' => (float) $balance->quantity,
                ];
            });

        // 2. Performances Zootechniques (7 derniers jours)
        $sevenDaysAgo = Carbon::now()->subDays(6)->startOfDay(); // including today
        $today = Carbon::now()->endOfDay();

        // Retrieve eggs per day
        $eggsData = DailyProduction::select(DB::raw('DATE(date) as date'), DB::raw('SUM(quantity) as total_eggs'))
            ->whereBetween('date', [$sevenDaysAgo, $today])
            ->groupBy(DB::raw('DATE(date)'))
            ->get()
            ->keyBy('date');

        // Retrieve mortality per day
        $mortalityData = FlockMortality::select(DB::raw('DATE(date) as date'), DB::raw('SUM(quantity) as total_mortality'))
            ->whereBetween('date', [$sevenDaysAgo, $today])
            ->groupBy(DB::raw('DATE(date)'))
            ->get()
            ->keyBy('date');

        $zootechnieStats = [];
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->subDays(6 - $i)->format('Y-m-d');
            $displayDate = Carbon::now()->subDays(6 - $i)->format('d/m');

            $zootechnieStats[] = [
                'date' => $displayDate,
                'eggs' => isset($eggsData[$date]) ? (int) $eggsData[$date]->total_eggs : 0,
                'mortality' => isset($mortalityData[$date]) ? (int) $mortalityData[$date]->total_mortality : 0,
            ];
        }

        // 3. Santé Financière (Mois en cours)
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // active financial year
        $activeYear = FinancialYear::where('is_closed', false)
            ->where('start_date', '<=', Carbon::now())
            ->where('end_date', '>=', Carbon::now())
            ->first();

        $revenues = 0;
        $materialExpenses = 0;
        $payrollExpenses = 0;

        if ($activeYear) {
            $salesAccount = Account::where('number', Account::CODE_SALES)->first();
            $purchasesAccount = Account::where('number', Account::CODE_PURCHASES)->first();
            $salariesAccount = Account::where('number', Account::CODE_SALARIES_EXPENSE)->first();

            $baseQuery = AccountingEntryLine::whereHas('accountingEntry', function ($query) use ($activeYear, $startOfMonth, $endOfMonth) {
                $query->where('financial_year_id', $activeYear->id)
                      ->whereBetween('date', [$startOfMonth, $endOfMonth])
                      ->where('status', 'validated'); // assuming we only count validated entries, or perhaps all? Usually accounting lines are only for validated entries, wait, the instruction says "interroge accounting_entry_lines... sur l'exercice en cours, pour le mois actuel". Drafts could be present.
            });

            if ($salesAccount) {
                $revenues = (float) (clone $baseQuery)->where('account_id', $salesAccount->id)->sum('credit');
            }

            if ($purchasesAccount) {
                $materialExpenses = (float) (clone $baseQuery)->where('account_id', $purchasesAccount->id)->sum('debit');
            }

            if ($salariesAccount) {
                $payrollExpenses = (float) (clone $baseQuery)->where('account_id', $salariesAccount->id)->sum('debit');
            }
        }

        $financialStats = [
            'revenues' => $revenues,
            'material_expenses' => $materialExpenses,
            'payroll_expenses' => $payrollExpenses,
        ];

        return Inertia::render('Dashboard', [
            'stockAlerts' => $stockAlerts,
            'zootechnieStats' => $zootechnieStats,
            'financialStats' => $financialStats,
        ]);
    }
}

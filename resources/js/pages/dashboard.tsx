// pages/dashboard.tsx
import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Wallet, 
    TrendingUp, 
    TrendingDown, 
    AlertTriangle, 
    Egg, 
    Skull, 
    Package, 
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    ShoppingCart,
    Coins
} from 'lucide-react';

interface StockAlert {
    name: string;
    symbol: string;
    quantity: number;
}

interface ZooStat {
    date: string;
    eggs: number;
    mortality: number;
}

interface FinStat {
    revenues: number;
    material_expenses: number;
    payroll_expenses: number;
}

interface Props {
    stockAlerts: StockAlert[]; // Injecté par le DashboardController[cite: 38]
    zootechnieStats: ZooStat[]; // Injecté par le DashboardController[cite: 38]
    financialStats: FinStat; // Injecté par le DashboardController[cite: 38]
}

export default function Dashboard({ stockAlerts, zootechnieStats, financialStats }: Props) {
    
    // --- CALCULS FINANCIERS ---
    const totalExpenses = financialStats.material_expenses + financialStats.payroll_expenses;
    const netMargin = financialStats.revenues - totalExpenses;
    const marginIsPositive = netMargin >= 0;

    // --- CALCULS POUR LE GRAPHIQUE ZOOTECHNIQUE (100% CSS) ---
    const maxEggs = Math.max(...zootechnieStats.map(s => s.eggs), 100); // Base minimum 100 pour l'échelle
    const maxMortality = Math.max(...zootechnieStats.map(s => s.mortality), 10); // Base minimum 10 pour l'échelle

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
            <Head title="Ferme-Landi | Tableau de Bord" />

            {/* EN-TÊTE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Activity className="w-8 h-8 text-primary" /> Vue d'ensemble
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Performances globales de l'exploitation pour le mois en cours.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date du jour</p>
                    <p className="text-lg font-bold text-foreground">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* SECTION 1 : KPIS FINANCIERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Carte Revenus */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-600">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 relative z-10">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Revenus (Ventes)</p>
                        <p className="text-3xl font-black text-foreground mt-1">
                            {financialStats.revenues.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">FCFA</span>
                        </p>
                    </div>
                </div>

                {/* Carte Dépenses (Matériel + Paie) */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingDown className="w-24 h-24 text-destructive" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="bg-destructive/10 p-3 rounded-xl text-destructive">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 relative z-10">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Dépenses</p>
                        <p className="text-3xl font-black text-foreground mt-1">
                            {totalExpenses.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">FCFA</span>
                        </p>
                        <div className="flex gap-4 mt-2 text-xs font-medium text-muted-foreground">
                            <span>Matériel: {financialStats.material_expenses.toLocaleString()}</span>
                            <span>Paie: {financialStats.payroll_expenses.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Carte Résultat / Marge */}
                <div className={`rounded-2xl p-6 border shadow-sm flex flex-col justify-between overflow-hidden relative ${marginIsPositive ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
                    <div className="flex justify-between items-start relative z-10">
                        <div className={`p-3 rounded-xl ${marginIsPositive ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                            <Coins className="w-6 h-6" />
                        </div>
                        <span className={`flex items-center gap-1 text-sm font-black px-3 py-1 rounded-full ${marginIsPositive ? 'text-primary bg-primary/10' : 'text-destructive bg-destructive/10'}`}>
                            {marginIsPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            Bilan Mensuel
                        </span>
                    </div>
                    <div className="mt-4 relative z-10">
                        <p className={`text-sm font-bold uppercase tracking-wider ${marginIsPositive ? 'text-primary/70' : 'text-destructive/70'}`}>
                            {marginIsPositive ? 'Bénéfice Net' : 'Déficit'}
                        </p>
                        <p className={`text-3xl font-black mt-1 ${marginIsPositive ? 'text-primary' : 'text-destructive'}`}>
                            {marginIsPositive ? '+' : ''}{netMargin.toLocaleString()} <span className="text-sm font-medium opacity-70">FCFA</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* SECTION 2 : GRAPHIQUES ET ALERTES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Graphique de Production (7 derniers jours) */}
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Egg className="w-5 h-5 text-primary" /> Production vs Mortalité
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Évolution zootechnique sur les 7 derniers jours.</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary"></div> Œufs pondus</span>
                            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-destructive"></div> Mortalité</span>
                        </div>
                    </div>

                    {/* Graphique CSS Custom */}
                    <div className="flex-1 flex items-end gap-2 sm:gap-4 h-64 mt-auto">
                        {zootechnieStats.map((stat, index) => {
                            // Calcul des hauteurs en pourcentage (max 100%)
                            const eggHeight = Math.max((stat.eggs / maxEggs) * 100, 2); 
                            const mortHeight = Math.max((stat.mortality / maxMortality) * 100, 2);

                            return (
                                <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                                    {/* Tooltip Hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] p-2 rounded-lg mb-2 text-center pointer-events-none z-10 whitespace-nowrap">
                                        <p className="font-bold mb-1">{stat.date}</p>
                                        <p className="text-primary-foreground">{stat.eggs} œufs</p>
                                        <p className="text-destructive-foreground">{stat.mortality} pertes</p>
                                    </div>
                                    
                                    {/* Barres */}
                                    <div className="w-full flex justify-center items-end gap-1 sm:gap-2 h-48 relative">
                                        <div 
                                            className="w-1/2 bg-primary rounded-t-md transition-all duration-500 hover:bg-primary/80" 
                                            style={{ height: `${eggHeight}%` }}
                                        />
                                        <div 
                                            className="w-1/2 bg-destructive rounded-t-md transition-all duration-500 hover:bg-destructive/80" 
                                            style={{ height: `${mortHeight}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground mt-3">{stat.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Alertes de Stock Critiques */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-destructive">
                        <AlertTriangle className="w-6 h-6" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Alertes Stocks</h2>
                            <p className="text-xs text-muted-foreground">Aliments & Médicaments critiques</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {stockAlerts.length > 0 ? (
                            stockAlerts.map((alert, index) => (
                                <div key={index} className="bg-muted/30 border border-border rounded-xl p-3 flex justify-between items-center transition-colors hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-destructive/10 p-2 rounded-lg text-destructive">
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <p className="font-bold text-sm text-foreground line-clamp-1" title={alert.name}>
                                            {alert.name}
                                        </p>
                                    </div>
                                    <div className="text-right whitespace-nowrap pl-2">
                                        <p className="text-sm font-black text-destructive">
                                            {alert.quantity} <span className="text-[10px] font-normal">{alert.symbol}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                                <Package className="w-12 h-12 text-muted-foreground" />
                                <p className="text-sm font-bold text-muted-foreground">Aucune rupture de stock détectée sur les aliments et la santé.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
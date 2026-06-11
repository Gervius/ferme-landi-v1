import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRightLeft, Plus, Calendar, User, TrendingDown, Settings2 } from 'lucide-react';
import { stockMovementsCreate } from '@/routes';
import { PaginatedData } from '@/types/pagination'; // <-- AJOUT
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface StockMovement {
    id: number;
    type: 'out' | 'adjustment';
    quantity: number;
    date: string;
    notes: string | null;
    site: { id: number; name: string };
    category: { id: number; name: string };
    unit: { id: number; name: string; symbol: string };
    creator: { id: number; name: string };
}

interface Props {
    stockMovements: PaginatedData<StockMovement>; // <-- CORRECTION
}

export default function Index({ stockMovements }: Props) {
    const columns: ColumnDef<StockMovement>[] = [
        // ... (Les colonnes restent exactement identiques)
        { 
            header: 'Date', 
            cell: (item) => (
                <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar size={14} className="text-muted-foreground" />
                    {new Date(item.date).toLocaleDateString()}
                </div>
            ) 
        },
        { header: 'Site', cell: (item) => <span className="font-semibold">{item.site.name}</span> },
        { header: 'Produit', cell: (item) => <span className="font-bold">{item.category.name}</span> },
        { 
            header: 'Type d\'Opération', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    item.type === 'out' 
                        ? 'bg-destructive/10 text-destructive border-destructive/20' 
                        : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                }`}>
                    {item.type === 'out' ? <TrendingDown size={12} /> : <Settings2 size={12} />}
                    {item.type === 'out' ? 'Sortie / Perte' : 'Ajustement (Inventaire)'}
                </span>
            )
        },
        { 
            header: 'Quantité', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-black text-foreground">
                    {Number(item.quantity).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{item.unit.symbol}</span>
                </span>
            ) 
        },
        { 
            header: 'Auteur', 
            cell: (item) => (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User size={12} /> {item.creator.name}
                </div>
            ) 
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <ArrowRightLeft className="text-primary" /> Mouvements de Stocks
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Historique des ajustements et sorties manuelles.</p>
                </div>
                <Link href={stockMovementsCreate.url()} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90">
                    <Plus size={18} /> Nouveau Mouvement
                </Link>
            </div>

            <DataTable data={stockMovements} columns={columns} emptyMessage="Aucun mouvement de stock enregistré." />
        </div>
    );
}
import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRightLeft, Plus, Calendar, User, TrendingDown, Settings2 } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface StockMovement {
    id: number;
    type: 'out' | 'adjustment';
    quantity: number;
    date: string;
    notes: string | null;
    site: { id: number; name: string };
    item: { id: number; name: string }; // Remplacement de category par item
    unit: { id: number; name: string; symbol: string };
    creator: { id: number; name: string };
}

interface Props {
    stockMovements: PaginatedData<StockMovement>;
}

export default function Index({ stockMovements }: Props) {
    const columns: ColumnDef<StockMovement>[] = [
        { 
            header: 'Date',
            cell: (movement) => (
                <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar size={14} className="text-muted-foreground" />
                    {new Date(movement.date).toLocaleDateString()}
                </div>
            ) 
        },
        { header: 'Site', cell: (movement) => <span className="font-semibold">{movement.site.name}</span> },
        // Remplacement de category.name par item.name
        { header: 'Produit', cell: (movement) => <span className="font-bold">{movement.item?.name}</span> },
        { 
            header: 'Type d\'Opération',
            cell: (movement) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    movement.type === 'out' 
                        ? 'bg-destructive/10 text-destructive border-destructive/20' 
                        : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                }`}>
                    {movement.type === 'out' ? <TrendingDown size={12} /> : <Settings2 size={12} />}
                    {movement.type === 'out' ? 'Sortie / Perte' : 'Ajustement (Inventaire)'}
                </span>
            )
        },
        { 
            header: 'Quantité',
            className: 'text-right',
            cell: (movement) => (
                <span className="font-black text-foreground">
                    {Number(movement.quantity).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{movement.unit.symbol}</span>
                </span>
            ) 
        },
        { 
            header: 'Auteur',
            cell: (movement) => (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User size={12} /> {movement.creator.name}
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
                {/* Routage Wayfinder */}
                <Link href="/stocks/stock-movements/create" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90">
                    <Plus size={18} /> Nouveau Mouvement
                </Link>
            </div>

            <DataTable data={stockMovements} columns={columns} emptyMessage="Aucun mouvement de stock enregistré." />
        </div>
    );
}
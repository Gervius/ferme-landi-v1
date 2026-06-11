import React from 'react';
import { LayoutGrid, MapPin, Package, Scale } from 'lucide-react';
import { PaginatedData } from '@/types/pagination'; // <-- AJOUT
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface StockBalance {
    id: number;
    quantity: number;
    site: { id: number; name: string };
    category: { id: number; name: string };
    unit: { id: number; name: string; symbol: string };
}

interface Props {
    stockBalances: PaginatedData<StockBalance>; // <-- CORRECTION
}

export default function Index({ stockBalances }: Props) {
    const columns: ColumnDef<StockBalance>[] = [
        // ... (Les colonnes restent exactement identiques)
        { 
            header: 'Site / Magasin', 
            cell: (item) => (
                <div className="flex items-center gap-2 text-foreground font-semibold">
                    <MapPin size={16} className="text-muted-foreground" />
                    {item.site.name}
                </div>
            ) 
        },
        { 
            header: 'Article / Produit', 
            cell: (item) => (
                <div className="flex items-center gap-2 font-bold text-card-foreground">
                    <Package size={16} className="text-muted-foreground" />
                    {item.category.name}
                </div>
            ) 
        },
        { 
            header: 'Quantité Disponible', 
            className: 'text-right',
            cell: (item) => (
                <span className={`font-black text-lg ${item.quantity <= 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {Number(item.quantity).toLocaleString()}
                </span>
            ) 
        },
        { 
            header: 'Unité', 
            cell: (item) => (
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
                    <Scale size={14} />
                    {item.unit.name} ({item.unit.symbol})
                </div>
            ) 
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <LayoutGrid className="text-primary" /> État des Stocks
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Consultez l'inventaire en temps réel de tous vos sites d'exploitation.
                </p>
            </div>

            <DataTable data={stockBalances} columns={columns} emptyMessage="Aucun stock enregistré." />
        </div>
    );
}
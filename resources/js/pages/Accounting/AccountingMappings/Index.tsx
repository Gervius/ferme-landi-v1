import React from 'react';
import { Link } from '@inertiajs/react';
import { Plus, Settings, GitMerge } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface Mapping {
    id: number;
    event_type: string;
    name: string;
    journal: { code: string; name: string };
    debitAccount: { number: string; name: string };
    creditAccount: { number: string; name: string };
    analyticalNature?: { code: string; name: string } | null;
}

interface Props {
    mappings: PaginatedData<Mapping>;
}

export default function Index({ mappings }: Props) {
    const columns: ColumnDef<Mapping>[] = [
        { 
            header: 'Événement', 
            cell: (item) => (
                <div>
                    <span className="font-bold text-foreground block">{item.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">{item.event_type}</span>
                </div>
            ) 
        },
        { 
            header: 'Journal', 
            cell: (item) => <span className="font-medium">{item.journal.code}</span> 
        },
        { 
            header: 'Débit', 
            cell: (item) => <span className="font-bold text-indigo-600">{item.debitAccount?.number}</span> 
        },
        { 
            header: 'Crédit', 
            cell: (item) => <span className="font-bold text-rose-600">{item.creditAccount?.number}</span> 
        },
        { 
            header: 'Nature Analytique', 
            cell: (item) => item.analyticalNature ? (
                <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent-foreground text-xs font-bold rounded-md">
                    {item.analyticalNature.code}
                </span>
            ) : <span className="text-muted-foreground text-xs">-</span>
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <GitMerge className="text-primary" /> Mappings Comptables
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Liez les actions métiers aux comptes du Grand Livre.</p>
                </div>
                <Link 
                    href="/accounting/accounting-mappings/create" 
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90"
                >
                    <Plus size={18} /> Nouveau Mapping
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm">
                <DataTable data={mappings} columns={columns} emptyMessage="Aucun paramétrage configuré." />
            </div>
        </div>
    );
}
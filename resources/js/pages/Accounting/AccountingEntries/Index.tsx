// pages/Accounting/AccountingEntries/Index.tsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, CheckCircle, Clock, BookOpen, Fingerprint, CalendarDays } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface AccountingEntry {
    id: number;
    reference: string;
    date: string;
    description: string;
    status: 'draft' | 'approved';
    financialYear: { id: number; year: string };
    accountingJournal: { id: number; code: string; name: string };
}

interface Props {
    accountingEntries: PaginatedData<AccountingEntry>;
}

export default function Index({ accountingEntries }: Props) {
    const handleApprove = (id: number) => {
        if (confirm("Valider cette écriture ? Une écriture validée ne peut plus être modifiée ni supprimée (principe comptable d'intangibilité).")) {
            // Remplacement par l'URL en dur
            router.post(`/accounting/accounting-entries/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Supprimer ce brouillon d'écriture comptable ?")) {
            // Remplacement par l'URL en dur
            router.delete(`/accounting/accounting-entries/${id}`, { preserveScroll: true });
        }
    };

    const columns: ColumnDef<AccountingEntry>[] = [
        {
            header: 'Date & Exercice',
            cell: (item) => (
                <div className="flex flex-col gap-0.5 text-sm">
                    <span className="font-bold text-foreground flex items-center gap-1.5"><CalendarDays size={14} className="text-muted-foreground"/> {new Date(item.date).toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">Exercice {item.financialYear?.year}</span>
                </div>
            )
        },
        {
            header: 'Journal',
            cell: (item) => (
                <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {item.accountingJournal?.code}
                </span>
            )
        },
        {
            header: 'N° de Pièce',
            cell: (item) => (
                <div className="flex items-center gap-2 font-mono font-black text-foreground">
                    <Fingerprint size={14} className="text-muted-foreground" />
                    {item.reference}
                </div>
            )
        },
        {
            header: 'Libellé de l\'opération',
            cell: (item) => <span className="text-sm font-medium text-card-foreground">{item.description}</span>
        },
        {
            header: 'Statut',
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'
                }`}>
                    {item.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {item.status === 'approved' ? 'Validé' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => item.status === 'draft' || !item.status ? (
                <div className="flex justify-end gap-2">
                    <button onClick={() => handleApprove(item.id)} className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                        Approuver
                    </button>
                    {/* Remplacement par l'URL en dur */}
                    <Link href={`/accounting/accounting-entries/${item.id}/edit`} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 size={16} />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            ) : (
                <span className="text-xs text-muted-foreground italic px-2">Verrouillé</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BookOpen className="text-primary" /> Écritures Comptables
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Saisie et consultation du journal des écritures (Grand Livre).</p>
                </div>
                {/* Remplacement par l'URL en dur */}
                <Link href="/accounting/accounting-entries/create" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={18} /> Nouvelle Écriture
                </Link>
            </div>

            <DataTable data={accountingEntries} columns={columns} emptyMessage="Aucune écriture comptable trouvée." />
        </div>
    );
}
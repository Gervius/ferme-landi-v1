// pages/Sales/Invoices/Index.tsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, FileDown, Receipt, FileText } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface Invoice {
    id: number;
    reference: string;
    invoice_date: string;
    due_date: string;
    status: 'draft' | 'approved';
    customer: { id: number; name: string };
    delivery_note: { id: number; reference: string };
}

interface Props {
    invoices: PaginatedData<Invoice>;
}

export default function Index({ invoices }: Props) {
    
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous la validation comptable de cette facture ?")) {
            router.post(`/sales/invoices/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    const columns: ColumnDef<Invoice>[] = [
        { header: 'N° Facture', cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> },
        { header: 'Client', cell: (item) => <span className="font-medium">{item.customer.name}</span> },
        { header: 'BL Associé', cell: (item) => <span className="text-sm text-muted-foreground">{item.delivery_note.reference}</span> },
        { header: 'Date', cell: (item) => new Date(item.invoice_date).toLocaleDateString() },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    item.status === 'approved' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'
                }`}>
                    {item.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {item.status === 'approved' ? 'Validée' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <a href={`/sales/invoices/${item.id}/pdf`} target="_blank" className="p-1.5 hover:bg-muted text-muted-foreground rounded-lg">
                        <FileDown size={16} />
                    </a>
                    {item.status === 'draft' && (
                        <button onClick={() => handleApprove(item.id)} className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90">
                            Approuver
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Receipt className="text-secondary" /> Factures Clients</h1>
                    <p className="text-muted-foreground text-sm">Suivi et comptabilisation des factures de vente.</p>
                </div>
                <Link href="/sales/invoices/create" className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold hover:opacity-90">
                    <Plus size={18} /> Nouvelle Facture
                </Link>
            </div>
            <DataTable data={invoices} columns={columns} emptyMessage="Aucune facture." />
        </div>
    );
}
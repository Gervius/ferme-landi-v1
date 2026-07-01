// pages/Sales/DeliveryNotes/Index.tsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, FileDown, Truck, PackageCheck } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface DeliveryNote {
    id: number;
    reference: string;
    delivery_date: string;
    status: 'draft' | 'approved'; // Géré par l'action ApproveDeliveryNoteAction
    sale_order?: { id: number; reference: string };
}

interface Props {
    deliveryNotes: PaginatedData<DeliveryNote>;
}

export default function Index({ deliveryNotes }: Props) {
    
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous la validation de ce bon de livraison ? Le stock sera automatiquement décrémenté.")) {
            router.post(`/sales/delivery-notes/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    const columns: ColumnDef<DeliveryNote>[] = [
        { header: 'N° BL', cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> },
        { header: 'Date', cell: (item) => new Date(item.delivery_date).toLocaleDateString() },
        { 
            header: 'Commande liée', 
            cell: (item) => item.sale_order ? (
                <span className="text-secondary font-medium">{item.sale_order.reference}</span>
            ) : <span className="text-muted-foreground italic">Vente directe</span>
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    item.status === 'approved' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'
                }`}>
                    {item.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {item.status === 'approved' ? 'Validé' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <a href={`/sales/delivery-notes/${item.id}/pdf`} target="_blank" className="p-1.5 hover:bg-muted text-muted-foreground rounded-lg">
                        <FileDown size={16} />
                    </a>
                    {item.status === 'draft' && (
                        <button onClick={() => handleApprove(item.id)} className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90">
                            Valider Stock
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Truck className="text-secondary" /> Bons de Livraison</h1>
                    <p className="text-muted-foreground text-sm">Gestion des sorties physiques de produits.</p>
                </div>
                <Link href="/sales/delivery-notes/create" className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold hover:opacity-90">
                    <Plus size={18} /> Nouveau BL
                </Link>
            </div>
            <DataTable data={deliveryNotes} columns={columns} emptyMessage="Aucun bon de livraison." />
        </div>
    );
}
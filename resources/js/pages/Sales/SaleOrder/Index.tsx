// pages/Sales/SaleOrder/Index.tsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit2, FileText, ShoppingCart, Truck, ClipboardList } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';


interface SaleOrder {
    id: number;
    reference: string;
    order_date: string;
    status: 'draft' | 'validated' | 'partially_delivered' | 'delivered' | 'closed';
    customer: { id: number; name: string };
}

interface Props {
    data: PaginatedData<SaleOrder>;
}

export default function Index({ data }: Props) {
    
    // Génération du Bon de Livraison (Flux métier Odoo)
   const handleGenerateDeliveryNote = (id: number) => {
        if (confirm("Générer le Bon de Livraison pour cette commande ?")) {
            router.post(`/sales/sale-orders/${id}/generate-delivery-note`);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            draft: 'bg-muted text-muted-foreground border-border',
            validated: 'bg-primary/10 text-primary border-primary/20',
            partially_delivered: 'bg-accent/10 text-accent-foreground border-accent/20',
            delivered: 'bg-primary/20 text-primary font-bold border-primary/30',
            closed: 'bg-muted text-muted-foreground border-border',
        };
        const labels: Record<string, string> = {
            draft: 'Brouillon',
            validated: 'Validé',
            partially_delivered: 'Partiel',
            delivered: 'Livré',
            closed: 'Clôturé',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${styles[status] || styles.draft}`}>
                {labels[status] || status}
            </span>
        );
    };

    const columns: ColumnDef<SaleOrder>[] = [
        { header: 'Référence', cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> },
        { header: 'Date', cell: (item) => new Date(item.order_date).toLocaleDateString() },
        { header: 'Client', cell: (item) => <span className="font-medium">{item.customer.name}</span> },
        { header: 'Statut', cell: (item) => getStatusBadge(item.status) },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-2">
                    {item.status === 'validated' && (
                        <button
                            onClick={() => handleGenerateDeliveryNote(item.id)}
                            className="flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1.5 rounded-md hover:opacity-90 shadow-sm"
                        >
                            <Truck size={14} /> Livraison
                        </button>
                    )}
                    {['draft', 'validated'].includes(item.status) && (
                        <Link href={`/sales/sale-orders/${item.id}/edit`} className="p-1.5 hover:bg-muted text-muted-foreground rounded-lg">
                            <Edit2 size={16} />
                        </Link>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <ShoppingCart className="text-primary" /> Commandes Client
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gérez le carnet de commandes et le flux de sortie.</p>
                </div>
                <Link href="/sales/sale-orders/create" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90">
                    <Plus size={18} /> Nouvelle Commande
                </Link>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucune commande client." />
        </div>
    );
}
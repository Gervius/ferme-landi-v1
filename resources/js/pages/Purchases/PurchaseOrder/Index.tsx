// pages/Purchases/PurchaseOrder/Index.tsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit2, FileText, ClipboardList, Receipt, Truck, Download } from 'lucide-react';
import { purchaseOrdersCreate, purchaseOrdersEdit, purchaseOrdersGenerateReceipt, purchaseOrdersPdf } from '@/routes';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface PurchaseOrder {
    id: number;
    reference: string;
    order_date: string;
    status: 'draft' | 'validated' | 'partially_received' | 'received' | 'cancelled';
    supplier: { id: number; name: string };
}

interface Props {
    data: PaginatedData<PurchaseOrder>;
}

export default function Index({ data }: Props) {
    
    // Déclenche la génération du bon de réception depuis la commande (Bouton d'action direct façon Odoo)
    const handleGenerateReceipt = (id: number) => {
        if (confirm("Générer le Bon de Réception pour cette commande ?")) {
            router.post(purchaseOrdersGenerateReceipt.url(id));
        }
    };

    // Configuration des badges de statut stylisés
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            draft: 'bg-muted text-muted-foreground border-border',
            validated: 'bg-primary/10 text-primary border-primary/20',
            partially_received: 'bg-accent/10 text-accent-foreground border-accent/20',
            received: 'bg-primary/20 text-primary font-bold border-primary/30',
            cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
        };
        const labels: Record<string, string> = {
            draft: 'Brouillon',
            validated: 'Validé',
            partially_received: 'Partiel',
            received: 'Reçu',
            cancelled: 'Annulé',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${styles[status] || styles.draft}`}>
                {labels[status] || status}
            </span>
        );
    };

    const columns: ColumnDef<PurchaseOrder>[] = [
        { 
            header: 'Référence', 
            cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> 
        },
        { 
            header: 'Date d\'ordre', 
            cell: (item) => new Date(item.order_date).toLocaleDateString() 
        },
        { 
            header: 'Fournisseur', 
            cell: (item) => <span className="font-medium text-card-foreground">{item.supplier.name}</span> 
        },
        { 
            header: 'Statut', 
            cell: (item) => getStatusBadge(item.status) 
        },
        {
            header: 'Actions / Flux',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Lien direct pour télécharger le PDF généré par le backend */}
                    <a 
                        href={purchaseOrdersPdf.url(item.id)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                        title="Télécharger le PDF"
                    >
                        <Download size={16} />
                    </a>

                    {item.status === 'validated' && (
                        <button
                            onClick={() => handleGenerateReceipt(item.id)}
                            className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-2.5 py-1.5 rounded-md hover:opacity-90 transition-opacity shadow-sm"
                            title="Créer la réception de stock"
                        >
                            <Truck size={14} /> Recevoir
                        </button>
                    )}
                    
                    {['draft', 'validated'].includes(item.status) && (
                        <Link 
                            href={purchaseOrdersEdit.url(item.id)} 
                            className="p-1.5 hover:bg-muted text-muted-foreground hover:text-primary rounded-lg transition-colors"
                        >
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
                        <ClipboardList className="text-secondary" /> Commandes d'Achat
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Planifiez vos ordres d'approvisionnement auprès de vos fournisseurs.</p>
                </div>
                <Link 
                    href={purchaseOrdersCreate.url()} 
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} /> Créer une commande
                </Link>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucune commande d'achat enregistrée." />
        </div>
    );
}
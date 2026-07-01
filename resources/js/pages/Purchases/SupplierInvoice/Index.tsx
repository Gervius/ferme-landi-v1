// pages/Purchases/SupplierInvoice/Index.tsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit2, FileText, CheckCircle, Clock, FileDown, Receipt } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface SupplierInvoice {
    id: number;
    reference: string;
    invoice_date: string;
    due_date: string | null;
    status: 'draft' | 'approved';
    supplier: { id: number; name: string };
    purchase_receipt: { id: number; reference: string };
}

interface Props {
    data: PaginatedData<SupplierInvoice>;
}

export default function Index({ data }: Props) {
    
    // Approbation de la facture (Validation comptable définitive)
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous l'approbation de cette facture ? Cette action générera les écritures comptables associées et verrouillera le document.")) {
            // URL absolue Wayfinder avec le préfixe
            router.post(`/purchases/supplier-invoices/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    const columns: ColumnDef<SupplierInvoice>[] = [
        { 
            header: 'N° Facture', 
            cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> 
        },
        { 
            header: 'Date Facture', 
            cell: (item) => new Date(item.invoice_date).toLocaleDateString() 
        },
        { 
            header: 'Échéance', 
            cell: (item) => item.due_date ? new Date(item.due_date).toLocaleDateString() : <span className="text-muted-foreground">-</span>
        },
        { 
            header: 'Fournisseur', 
            cell: (item) => <span className="font-medium text-card-foreground">{item.supplier.name}</span> 
        },
        { 
            header: 'BR Associé', 
            cell: (item) => (
                <span className="font-semibold text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                    {item.purchase_receipt.reference}
                </span>
            )
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    item.status === 'approved' 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-muted text-muted-foreground border-border'
                }`}>
                    {item.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {item.status === 'approved' ? 'Comptabilisée' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Impression PDF native via web.php */}
                    <a 
                        href={`/purchases/supplier-invoices/${item.id}/pdf`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                        title="Imprimer la facture"
                    >
                        <FileDown size={16} />
                    </a>

                    {item.status === 'draft' ? (
                        <button
                            onClick={() => handleApprove(item.id)}
                            className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            Approuver
                        </button>
                    ) : (
                        <span className="text-xs text-muted-foreground italic px-2">Validée</span>
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
                        <Receipt className="text-secondary" /> Factures d'Achats Fournisseurs
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Saisissez et contrôlez les factures reçues pour valider les dettes et préparer les paiements.
                    </p>
                </div>
                <Link 
                    href="/purchases/supplier-invoices/create" 
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} /> Enregistrer une Facture
                </Link>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucune facture fournisseur enregistrée." />
        </div>
    );
}
// pages/Purchases/PurchaseReceipt/Index.tsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit2, PackageOpen, CheckCircle, Clock, FileDown, ArrowDownToLine } from 'lucide-react';
import { purchaseReceiptsCreate, purchaseReceiptsEdit, purchaseReceiptsApprove, purchaseReceiptsPdf } from '@/routes';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface PurchaseReceipt {
    id: number;
    reference: string;
    receipt_date: string;
    status: 'draft' | 'approved'; // Géré par les actions backend
    purchase_order?: { id: number; reference: string } | null;
}

interface Props {
    data: PaginatedData<PurchaseReceipt>;
}

export default function Index({ data }: Props) {
    
    // Déclenche l'action d'approbation et l'incrémentation physique des stocks
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous la réception de ces marchandises ? Cette action mettra immédiatement à jour vos niveaux de stocks réels.")) {
            router.post(purchaseReceiptsApprove.url(id), {}, { preserveScroll: true });
        }
    };

    const columns: ColumnDef<PurchaseReceipt>[] = [
        { 
            header: 'Bon de Réception', 
            cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> 
        },
        { 
            header: 'Date Réception', 
            cell: (item) => new Date(item.receipt_date).toLocaleDateString() 
        },
        { 
            header: 'Commande d\'Origine', 
            cell: (item) => item.purchase_order ? (
                <span className="font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded text-xs">
                    {item.purchase_order.reference}
                </span>
            ) : (
                <span className="text-muted-foreground text-xs italic">Réception Directe (Sans commande)</span>
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
                    {item.status === 'approved' ? 'Approuvé (En Stock)' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Lien PDF natif */}
                    <a 
                        href={purchaseReceiptsPdf.url(item.id)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                        title="Imprimer le bon de réception"
                    >
                        <FileDown size={16} />
                    </a>

                    {item.status === 'draft' ? (
                        <>
                            <button
                                onClick={() => handleApprove(item.id)}
                                className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                Valider Stock
                            </button>
                            <Link 
                                href={purchaseReceiptsEdit.url(item.id)} 
                                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-secondary rounded-lg transition-colors"
                            >
                                <Edit2 size={16} />
                            </Link>
                        </>
                    ) : (
                        <span className="text-xs text-muted-foreground italic px-2">Verrouillé</span>
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
                        <PackageOpen className="text-secondary" /> Réceptions de Stocks & Logistique
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Suivez les entrées de marchandises en magasin et validez les livraisons fournisseurs.
                    </p>
                </div>
                <Link 
                    href={purchaseReceiptsCreate.url()} 
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} /> Réceptionner Marchandise
                </Link>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucun bon de réception de stock enregistré." />
        </div>
    );
}
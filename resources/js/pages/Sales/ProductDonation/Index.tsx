import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, HeartHandshake, Gift, Hash } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface ProductDonation {
    id: number;
    reference: string; // Ajout de la référence générée
    date: string;
    beneficiary_name: string;
    quantity: number;
    valorization_price: number;
    status: 'draft' | 'approved';
    item: { id: number; name: string; category?: { name: string } }; // Ciblage physique strict
}

interface Props {
    data: PaginatedData<ProductDonation>;
}

export default function Index({ data }: Props) {
    
    // Validation du don (Décrémente le stock)
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous ce don ? La quantité sera définitivement déduite du stock physique.")) {
            // Remplacement Wayfinder par l'URI en dur
            router.post(`/sales/product-donations/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    const columns: ColumnDef<ProductDonation>[] = [
        { header: 'Référence', cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> },
        { header: 'Date', cell: (item) => new Date(item.date).toLocaleDateString() },
        { 
            header: 'Bénéficiaire', 
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <HeartHandshake size={16} className="text-muted-foreground" />
                    <span className="font-bold text-foreground">{item.beneficiary_name}</span>
                </div>
            ) 
        },
        { 
            header: 'Produit (Physique)', 
            cell: (item) => (
                <span className="font-medium text-card-foreground">
                    {item.item?.name} {item.item?.category && <span className="text-xs text-muted-foreground">({item.item.category.name})</span>}
                </span>
            ) 
        },
        { 
            header: 'Quantité Offerte', 
            className: 'text-center',
            cell: (item) => <span className="font-bold text-primary">{item.quantity}</span> 
        },
        { 
            header: 'Valeur (Compta)', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-medium">
                    {Number(item.quantity * item.valorization_price).toLocaleString()} <span className="text-xs text-muted-foreground">FCFA</span>
                </span>
            )
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
            cell: (item) => item.status === 'draft' ? (
                <button onClick={() => handleApprove(item.id)} className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 shadow-sm">
                    Approuver Stock
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic px-2">Traité</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Gift className="text-primary" /> Dons & Mécénat (Sorties de Stock)
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gérez les sorties de produits à titre gratuit pour régulariser vos inventaires.
                    </p>
                </div>

                <Link href="/sales/product-donations/create" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                    <Plus size={18} /> Nouveau Don
                </Link>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucun don enregistré pour le moment." />
        </div>
    );
}
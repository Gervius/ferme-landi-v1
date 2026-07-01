// pages/Purchases/SupplierPayment/Index.tsx
import React, { useMemo } from 'react';
import { router, Link } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Wallet, Banknote, Landmark, Smartphone, Coins } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface SupplierPayment {
    id: number;
    reference: string;
    payment_date: string;
    amount: number;
    payment_method: 'especes' | 'cheque' | 'virement' | 'mobile_money';
    status: 'draft' | 'approved';
    notes: string | null;
    supplier: { id: number; name: string };
}

interface Props {
    data: PaginatedData<SupplierPayment>;
}

export default function Index({ data }: Props) {
    
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous l'approbation de ce règlement ? L'argent sera définitivement déduit de votre compte financier.")) {
            router.post(`/purchases/supplier-payments/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    // Optimisation de la RAM : Calcul de la masse financière décaissée affichée
    const totalDisbursed = useMemo(() => {
        return data.data.reduce((sum, item) => sum + Number(item.amount), 0);
    }, [data.data]);

    // Pattern de mapping visuel pour les méthodes de règlement
    const methodStrategy = {
        especes: { label: 'Espèces', icon: Coins, color: 'text-amber-500 bg-amber-50' },
        cheque: { label: 'Chèque', icon: Banknote, color: 'text-blue-500 bg-blue-50' },
        virement: { label: 'Virement', icon: Landmark, color: 'text-indigo-500 bg-indigo-50' },
        mobile_money: { label: 'Mobile Money', icon: Smartphone, color: 'text-emerald-500 bg-emerald-50' },
    };

    const columns: ColumnDef<SupplierPayment>[] = [
        { 
            header: 'Date', 
            cell: (item) => new Date(item.payment_date).toLocaleDateString() 
        },
        { 
            header: 'Référence Pièce', 
            cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> 
        },
        { 
            header: 'Bénéficiaire (Fournisseur)', 
            cell: (item) => <span className="font-medium text-card-foreground">{item.supplier.name}</span> 
        },
        { 
            header: 'Mode de Paiement', 
            cell: (item) => {
                const config = methodStrategy[item.payment_method] || { label: item.payment_method, icon: Coins, color: 'bg-muted text-muted-foreground' };
                return (
                    <div className="flex items-center gap-1.5">
                        <config.icon size={16} className={config.color.split(' ')[0]} />
                        <span className="text-sm font-medium text-card-foreground">{config.label}</span>
                    </div>
                );
            }
        },
        { 
            header: 'Montant Réglé', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-extrabold text-foreground">
                    {Number(item.amount).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">FCFA</span>
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
                    {item.status === 'approved' ? 'Validé' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => item.status === 'draft' ? (
                <button
                    onClick={() => handleApprove(item.id)}
                    className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                >
                    Approuver
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic px-2">Comptabilisé</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            
            {/* Titre & Stat de Caisse */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Wallet className="text-secondary" /> Décaissements & Règlements
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Suivez les sorties de fonds et payez les factures de vos fournisseurs d'aliments et de matériels.
                    </p>
                </div>

                <div className="bg-card border border-border px-5 py-3 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                        <Banknote size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Décaissé (Page)</p>
                        <p className="text-xl font-black text-foreground">{totalDisbursed.toLocaleString()} <span className="text-xs font-bold text-muted-foreground">FCFA</span></p>
                    </div>
                </div>
            </div>

            {/* Barre de contrôle avec Lien vers Create */}
            <div className="flex justify-end mb-2">
                <Link 
                    href="/purchases/supplier-payments/create"
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity"
                >
                    <Plus size={18} />
                    Émettre un paiement
                </Link>
            </div>

            {/* Intégration de la table réutilisable */}
            <DataTable data={data} columns={columns} emptyMessage="Aucun décaissement fournisseur enregistré." />
        </div>
    );
}
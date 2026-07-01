import React, { useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Wallet, Banknote, Landmark, Smartphone, Coins } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface CustomerPayment {
    id: number;
    reference: string;
    payment_date: string;
    amount: number;
    payment_method: 'especes' | 'cheque' | 'virement' | 'mobile_money';
    status: 'draft' | 'approved';
    notes: string | null;
    customer: { id: number; name: string };
}

interface Props {
    data: PaginatedData<CustomerPayment>;
    // On ne reçoit plus "customers" pour préserver la RAM
}

export default function Index({ data }: Props) {

    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous la validation de cet encaissement ? Les fonds seront immédiatement injectés dans la trésorerie de la ferme.")) {
            router.post(`/sales/customer-payments/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    const totalInvoiced = useMemo(() => {
        return data.data.reduce((sum, item) => sum + Number(item.amount), 0);
    }, [data.data]);

    const methodStrategy = {
        especes: { label: 'Caisse / Espèces', icon: Coins, color: 'text-amber-500 bg-amber-50' },
        cheque: { label: 'Chèque', icon: Banknote, color: 'text-blue-500 bg-blue-50' },
        virement: { label: 'Virement', icon: Landmark, color: 'text-indigo-500 bg-indigo-50' },
        mobile_money: { label: 'Orange / Moov Money', icon: Smartphone, color: 'text-emerald-500 bg-emerald-50' },
    };

    const columns: ColumnDef<CustomerPayment>[] = [
        { header: 'Date', cell: (item) => new Date(item.payment_date).toLocaleDateString() },
        { header: 'N° Reçu / Pièce', cell: (item) => <span className="font-bold text-foreground">{item.reference}</span> },
        { header: 'Client', cell: (item) => <span className="font-medium text-card-foreground">{item.customer.name}</span> },
        { 
            header: 'Mode', 
            cell: (item) => {
                const config = methodStrategy[item.payment_method] || { label: item.payment_method, icon: Coins, color: 'bg-muted' };
                return (
                    <div className="flex items-center gap-1.5">
                        <config.icon size={16} className={config.color.split(' ')[0]} />
                        <span className="text-sm font-medium">{config.label}</span>
                    </div>
                );
            }
        },
        { 
            header: 'Montant Encaissé', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-extrabold text-primary">
                    {Number(item.amount).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">FCFA</span>
                </span>
            )
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    item.status === 'approved' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'
                }`}>
                    {item.status === 'approved' ? 'Validé (En Caisse)' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => item.status === 'draft' ? (
                <button onClick={() => handleApprove(item.id)} className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 shadow-sm">
                    Approuver
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic px-2">Comptabilisé</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Wallet className="text-primary" /> Règlements & Encaissements Clients
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Suivez les entrées de fonds de vos clients (Ventes d'œufs, réformes, porcs).
                    </p>
                </div>

                <div className="bg-card border border-border px-5 py-3 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Banknote size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Encaissé (Page)</p>
                        <p className="text-xl font-black text-foreground">{totalInvoiced.toLocaleString()} <span className="text-xs font-bold text-muted-foreground">FCFA</span></p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mb-2">
                {/* Remplacement de la modale par un simple Link vers la page dédiée */}
                <Link href="/sales/customer-payments/create" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                    <Plus size={18} /> Enregistrer un Encaissement
                </Link>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucun encaissement client répertorié." />
        </div>
    );
}
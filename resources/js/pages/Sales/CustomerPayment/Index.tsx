// pages/Sales/CustomerPayment/Index.tsx
import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Wallet, Banknote, Landmark, Smartphone, Coins } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Remplacer par tes vrais alias de routes définis dans ton fichier d'export
const customerPaymentsStore = { url: () => '/sales/customer-payments' };
const customerPaymentsApprove = { url: (id: number) => `/sales/customer-payments/${id}/approve` };

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
    customers: { id: number; name: string }[];
}

export default function Index({ data, customers }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: formData, setData, post, processing, errors, reset } = useForm({
        customer_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        reference: '',
        amount: 0,
        payment_method: 'especes',
        notes: '',
    });

    const submitCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(customerPaymentsStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous la validation de cet encaissement ? Les fonds seront immédiatement injectés dans la trésorerie de la ferme.")) {
            router.post(customerPaymentsApprove.url(id), {}, { preserveScroll: true });
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

            {/* Modale d'enregistrement rapide */}
            <div className="flex justify-end mb-2">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                            <Plus size={18} /> Enregistrer un Encaissement
                        </button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-foreground">Nouvel Encaissement Client</DialogTitle>
                            <DialogDescription>Enregistrez le règlement partiel ou total d'une facture client.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreate} className="space-y-4 mt-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Client débiteur</label>
                                <select value={formData.customer_id} onChange={e => setData('customer_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 text-sm">
                                    <option value="">Sélectionner le client...</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.customer_id && <span className="text-destructive text-xs font-medium">{errors.customer_id}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">N° de reçu / Réf</label>
                                    <input type="text" value={formData.reference} onChange={e => setData('reference', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5" placeholder="Ex: RC-0042" />
                                    {errors.reference && <span className="text-destructive text-xs font-medium">{errors.reference}</span>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Date de règlement</label>
                                    <input type="date" value={formData.payment_date} onChange={e => setData('payment_date', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-primary">Montant versé</label>
                                    <input type="number" min="0.01" step="0.01" value={formData.amount || ''} onChange={e => setData('amount', Number(e.target.value))} className="w-full bg-primary/5 border border-primary/30 rounded-lg p-2.5 font-bold text-primary text-lg" placeholder="Ex: 150000" />
                                    {errors.amount && <span className="text-destructive text-xs font-medium">{errors.amount}</span>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Mode de perception</label>
                                    <select value={formData.payment_method} onChange={e => setData('payment_method', e.target.value as any)} className="w-full bg-input border border-border rounded-lg p-2.5 text-sm">
                                        <option value="especes">Espèces / Caisse</option>
                                        <option value="cheque">Chèque</option>
                                        <option value="virement">Virement Bancaire</option>
                                        <option value="mobile_money">Orange / Moov Money</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Notes complémentaires (Optionnel)</label>
                                <textarea value={formData.notes} onChange={e => setData('notes', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 min-h-[60px] resize-none" placeholder="Commentaire libre..." />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</button>
                                <button type="submit" disabled={processing} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:opacity-90">Enregistrer</button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucun encaissement client répertorié." />
        </div>
    );
}
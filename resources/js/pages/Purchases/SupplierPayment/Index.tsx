// pages/Purchases/SupplierPayment/Index.tsx
import React, { useState, useMemo } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Wallet, Banknote, Landmark, Smartphone, Coins } from 'lucide-react';
import { supplierPaymentsStore, supplierPaymentsApprove } from '@/routes';
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
    data: PaginatedData<SupplierPayment>; // Historique paginé renvoyé par l'index backend
    suppliers: { id: number; name: string }[]; // Injecté dans l'index pour alimenter le select de la modale
}

export default function Index({ data, suppliers }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialisation du formulaire couplé aux règles strictes du StoreSupplierPaymentRequest
    const { data: formData, setData, post, processing, errors, reset } = useForm({
        supplier_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        reference: '',
        amount: 0,
        payment_method: 'especes',
        notes: '',
    });

    // Soumission du paiement (Mode Brouillon initial)
    const submitCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(supplierPaymentsStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    // Approbation manuelle pour figer le décaissement
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous l'approbation de ce règlement ? L'argent sera définitivement déduit de votre compte financier.")) {
            router.post(supplierPaymentsApprove.url(id), {}, { preserveScroll: true });
        }
    };

    // Optimisation de la RAM : Calcul de la masse financière décaissée affichée
    const totalDisbursed = useMemo(() => {
        return data.data.reduce((sum, item) => sum + Number(item.amount), 0);
    }, [data.data]);

    // Pattern de mapping visuel pour les méthodes de règlement (Évite les ternaires)
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

            {/* Barre de contrôle avec Modale Intégrée */}
            <div className="flex justify-end mb-2">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                            <Plus size={18} />
                            Émettre un paiement
                        </button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-foreground">Saisir un Règlement Fournisseur</DialogTitle>
                            <DialogDescription>
                                Enregistrez le paiement d'une facture. Les fonds ne seront déduits de la trésorerie qu'après approbation.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreate} className="space-y-4 mt-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Fournisseur bénéficiaire</label>
                                <select 
                                    value={formData.supplier_id}
                                    onChange={e => setData('supplier_id', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 text-sm"
                                >
                                    <option value="">Sélectionner le bénéficiaire</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                {errors.supplier_id && <span className="text-destructive text-xs font-medium">{errors.supplier_id}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Référence de pièce</label>
                                    <input 
                                        type="text"
                                        value={formData.reference}
                                        onChange={e => setData('reference', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5"
                                        placeholder="Ex: CHQ-BOA-045"
                                    />
                                    {errors.reference && <span className="text-destructive text-xs font-medium">{errors.reference}</span>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Date de décaissement</label>
                                    <input 
                                        type="date"
                                        value={formData.payment_date}
                                        onChange={e => setData('payment_date', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5"
                                    />
                                    {errors.payment_date && <span className="text-destructive text-xs font-medium">{errors.payment_date}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-secondary">Montant à régler</label>
                                    <input 
                                        type="number" min="0.01" step="0.01"
                                        value={formData.amount || ''}
                                        onChange={e => setData('amount', Number(e.target.value))}
                                        className="w-full bg-secondary/5 border border-secondary/30 rounded-lg p-2.5 font-bold text-secondary text-lg"
                                        placeholder="Ex: 500000"
                                    />
                                    {errors.amount && <span className="text-destructive text-xs font-medium">{errors.amount}</span>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Mode de règlement</label>
                                    <select 
                                        value={formData.payment_method}
                                        onChange={e => setData('payment_method', e.target.value as any)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 text-sm"
                                    >
                                        <option value="especes">Espèces / Caisse</option>
                                        <option value="cheque">Chèque Bancaire</option>
                                        <option value="virement">Virement Bancaire</option>
                                        <option value="mobile_money">Orange Money / Moov Money</option>
                                    </select>
                                    {errors.payment_method && <span className="text-destructive text-xs font-medium">{errors.payment_method}</span>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold">Notes / Justificatif (Optionnel)</label>
                                <textarea 
                                    value={formData.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 min-h-[60px] resize-none"
                                    placeholder="Ex: Paiement facture du maïs concassé..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                                    Annuler
                                </button>
                                <button type="submit" disabled={processing} className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:opacity-90">
                                    Enregistrer (Brouillon)
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Intégration de la table réutilisable */}
            <DataTable data={data} columns={columns} emptyMessage="Aucun décaissement fournisseur enregistré." />
        </div>
    );
}
import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Wallet, Banknote, Smartphone, CreditCard, Receipt } from 'lucide-react';

interface Invoice {
    id: number;
    supplier_id: number;
    reference: string;
    total_amount: number;
}

interface Props {
    suppliers: { id: number; name: string }[];
    pendingInvoices?: Invoice[]; // Les factures validées non payées envoyées par le contrôleur
}

export default function CreateSupplierPayment({ suppliers, pendingInvoices = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        supplier_invoice_id: '', // NOUVEAU : Pour le lettrage comptable
        payment_date: new Date().toISOString().split('T')[0],
        reference: `DEC-${Date.now().toString().slice(-6)}`,
        amount: '',
        payment_method: 'virement',
        notes: '',
    });

    const breadcrumbs = [
        { title: 'Achats', href: '#' },
        { title: 'Paiements', href: '/purchases/supplier-payments' },
        { title: 'Décaissement', href: '#' },
    ];

    // NOUVEAU : Filtrage dynamique des factures selon le fournisseur sélectionné
    const availableInvoices = pendingInvoices.filter(
        inv => inv.supplier_id === Number(data.supplier_id)
    );

    // NOUVEAU : Auto-remplissage du montant à la sélection de la facture
    const handleInvoiceSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const invoiceId = e.target.value;
        setData('supplier_invoice_id', invoiceId);
        
        const selectedInvoice = availableInvoices.find(inv => inv.id === Number(invoiceId));
        if (selectedInvoice) {
            setData('amount', selectedInvoice.total_amount.toString());
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/purchases/supplier-payments');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Règlement Fournisseur" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href="/purchases/supplier-payments" className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-destructive/5 flex items-center gap-3">
                    <div className="p-3 bg-destructive/10 rounded-full text-destructive">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Décaissement / Paiement Fournisseur</h2>
                        <p className="text-sm text-muted-foreground italic">Tracez les sorties de fonds pour régler vos fournisseurs.</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* 1. Sélection du Fournisseur */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Fournisseur à payer</label>
                            <select 
                                value={data.supplier_id} 
                                onChange={e => setData('supplier_id', e.target.value)} 
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-destructive/20 font-bold"
                            >
                                <option value="">--- Sélectionner le fournisseur ---</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.supplier_id && <p className="text-destructive text-[10px] font-bold">{errors.supplier_id}</p>}
                        </div>

                        {/* 2. NOUVEAU BLOC : Sélection de la Facture (Lettrage) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter flex items-center gap-1">
                                <Receipt size={14} /> Facture à régler (Optionnel)
                            </label>
                            <select 
                                value={data.supplier_invoice_id} 
                                onChange={handleInvoiceSelection}
                                disabled={!data.supplier_id}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-destructive/20 font-bold disabled:opacity-50"
                            >
                                <option value="">--- Acompte ou paiement libre ---</option>
                                {availableInvoices.map(inv => (
                                    <option key={inv.id} value={inv.id}>
                                        {inv.reference} - {Number(inv.total_amount).toLocaleString()} FCFA
                                    </option>
                                ))}
                            </select>
                            {/* Optionnel : tu pourras ajouter la gestion d'erreur backend ici si tu le souhaites plus tard */}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Référence (Chèque / Virement)</label>
                            <input type="text" value={data.reference} onChange={e => setData('reference', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-mono font-bold" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Date du paiement</label>
                            <input type="date" value={data.payment_date} onChange={e => setData('payment_date', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none" />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Canal de paiement</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                    { id: 'virement', label: 'Virement', icon: Wallet },
                                    { id: 'cheque', label: 'Chèque', icon: CreditCard },
                                    { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
                                    { id: 'especes', label: 'Espèces', icon: Banknote },
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setData('payment_method', method.id as any)}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition ${
                                            data.payment_method === method.id 
                                            ? 'bg-destructive border-destructive text-destructive-foreground' 
                                            : 'bg-background border-border text-muted-foreground hover:border-destructive/50'
                                        }`}
                                    >
                                        <method.icon className="w-4 h-4" />
                                        {method.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-destructive/5 p-6 rounded-xl border border-destructive/20 flex flex-col items-center justify-center space-y-2 mt-6">
                        <label className="text-xs font-black uppercase text-destructive/70 tracking-widest">Montant Décaissé</label>
                        <div className="relative w-full max-w-xs">
                            <input 
                                type="number" 
                                step="0.01" 
                                placeholder="0" 
                                value={data.amount} 
                                onChange={e => setData('amount', e.target.value)} 
                                className="w-full bg-background border-2 border-destructive/30 rounded-xl px-4 py-4 text-center text-4xl font-black text-destructive focus:border-destructive outline-none" 
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-destructive/40 uppercase">FCFA</span>
                        </div>
                        {errors.amount && <p className="text-destructive text-sm font-bold mt-2">{errors.amount}</p>}
                    </div>
                </div>

                <div className="flex justify-end p-6 border-t border-border bg-muted/10">
                    <button type="submit" disabled={processing} className="bg-destructive hover:bg-destructive/90 text-white px-12 py-3.5 rounded-xl font-black shadow-xl flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        {processing ? 'Traitement...' : 'Enregistrer le Décaissement'}
                    </button>
                </div>
            </form>
        </div>
    );
}
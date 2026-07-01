import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, ArrowLeft, HandCoins, Info, Banknote, Smartphone, Wallet, CreditCard 
} from 'lucide-react';

interface Props {
    customers: { id: number; name: string }[];
}

export default function CreateCustomerPayment({ customers }: Props) {
    const { auth } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        site_id: auth.user.current_site_id, // Injecté silencieusement
        customer_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        amount: '',
        payment_method: 'especes',
        notes: '',
    });

    const breadcrumbs = [
        { title: 'Ventes', href: '#' },
        { title: 'Paiements', href: '/sales/customer-payments' },
        { title: 'Saisie Encaissement', href: '#' },
    ];

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post('/sales/customer-payments');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Saisie Paiement" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href="/sales/customer-payments" className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-primary/5 flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <HandCoins className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Enregistrement d'un Encaissement</h2>
                        <p className="text-sm text-muted-foreground italic">Veuillez renseigner les détails du règlement reçu.</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client */}
                        <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Client Émetteur</label>
                            <select
                                value={data.customer_id}
                                onChange={e => setData('customer_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition font-bold"
                            >
                                <option value="">--- Sélectionner le client ---</option>
                                {customers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.customer_id && <p className="text-destructive text-[10px] font-bold">{errors.customer_id}</p>}
                        </div>

                        {/* Date de réception */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Date de réception</label>
                            <input
                                type="date"
                                value={data.payment_date}
                                onChange={e => setData('payment_date', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                            />
                        </div>

                        {/* Mode de Paiement */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Mode de règlement</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {[
                                    { id: 'especes', label: 'Espèces', icon: Banknote },
                                    { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
                                    { id: 'virement', label: 'Virement', icon: Wallet },
                                    { id: 'cheque', label: 'Chèque', icon: CreditCard },
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setData('payment_method', method.id as any)}
                                        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-bold transition ${
                                            data.payment_method === method.id 
                                            ? 'bg-primary border-primary text-primary-foreground shadow-sm' 
                                            : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                                        }`}
                                    >
                                        <method.icon className="w-4 h-4" />
                                        {method.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Montant - Mis en évidence */}
                    <div className="bg-muted/30 p-6 rounded-xl border border-border flex flex-col items-center justify-center space-y-2">
                        <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Montant Encaissé</label>
                        <div className="relative w-full max-w-xs">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                value={data.amount}
                                onChange={e => setData('amount', e.target.value)}
                                className="w-full bg-background border-2 border-primary/20 rounded-xl px-4 py-4 text-center text-4xl font-black text-primary focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-primary/40 uppercase">FCFA</span>
                        </div>
                        {errors.amount && <p className="text-destructive text-[10px] font-bold">{errors.amount}</p>}
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Notes complémentaires (Optionnel)</label>
                        <textarea
                            rows={2}
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm"
                            placeholder="Observations, références bancaires..."
                        />
                    </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="w-4 h-4 text-primary shrink-0" />
                        L'encaissement sera validé après approbation par le responsable financier.
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3.5 rounded-xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Traitement...' : 'Enregistrer l\'Encaissement'}
                    </button>
                </div>
            </form>
        </div>
    );
}
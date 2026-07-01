import React, { useMemo } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, ArrowLeft, HeartHandshake, Package, Info, Gift, Calculator
} from 'lucide-react';

interface ItemResource {
    id: number;
    name: string;
    category?: { id: number; name: string };
    default_unit?: { id: number; symbol: string };
}

interface Props {
    items: ItemResource[];
}

export default function CreateProductDonation({ items }: Props) {
    const { auth } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        site_id: auth.user.current_site_id, // Injecté silencieusement
        date: new Date().toISOString().split('T')[0],
        beneficiary_name: '',
        item_id: '',
        quantity: 1,
        valorization_price: 0,
    });

    const breadcrumbs = [
        { title: 'Ventes', href: '#' },
        { title: 'Dons & Mécénat', href: '/sales/product-donations' },
        { title: 'Saisie d\'un Don', href: '#' },
    ];

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post('/sales/product-donations');
    };

    const totalValue = useMemo(() => {
        return (data.quantity || 0) * (data.valorization_price || 0);
    }, [data.quantity, data.valorization_price]);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Saisie d'un Don" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href="/sales/product-donations" className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-bold">
                        Le formulaire contient des erreurs. Veuillez vérifier les champs en rouge.
                    </div>
                )}

                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-primary/5 flex items-center gap-3">
                        <Gift className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Enregistrement d'un Don (Sortie de Stock)</h2>
                            <p className="text-sm text-muted-foreground italic">
                                Les dons décrémentent le stock physique et doivent être valorisés pour la comptabilité.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                                <HeartHandshake className="w-4 h-4" /> Bénéficiaire du don
                            </label>
                            <input
                                type="text"
                                value={data.beneficiary_name}
                                onChange={e => setData('beneficiary_name', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 text-lg font-bold"
                                placeholder="Ex: Orphelinat Sainte-Marie, Mairie centrale..."
                            />
                            {errors.beneficiary_name && <p className="text-destructive text-[10px] font-bold">{errors.beneficiary_name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Date de la remise</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                            />
                            {errors.date && <p className="text-destructive text-[10px] font-bold">{errors.date}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2 text-sm font-bold">
                        <Package className="w-4 h-4 text-secondary" /> Détails du Produit Offert
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Produit (Physique)</label>
                            <select
                                value={data.item_id}
                                onChange={e => setData('item_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-secondary/20 font-bold"
                            >
                                <option value="">--- Sélectionner un produit ---</option>
                                {items?.map(i => (
                                    <option key={i.id} value={i.id}>
                                        {i.name} {i.category ? `(${i.category.name})` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.item_id && <p className="text-destructive text-[10px] font-bold">{errors.item_id}</p>}
                        </div>

                        <div className="space-y-1.5 flex gap-4">
                            <div className="w-full">
                                <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Quantité</label>
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={data.quantity}
                                    onChange={e => setData('quantity', Number(e.target.value))}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-right font-bold text-secondary"
                                />
                                {errors.quantity && <p className="text-destructive text-[10px] font-bold">{errors.quantity}</p>}
                            </div>
                            <div className="w-24 shrink-0">
                                <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Unité</label>
                                <div className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-center text-muted-foreground font-medium">
                                    {data.item_id ? items.find(i => i.id === Number(data.item_id))?.default_unit?.symbol || '-' : '-'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter flex justify-between">
                                Valeur Unitaire Estimée (Pour Comptabilité)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.valorization_price}
                                    onChange={e => setData('valorization_price', Number(e.target.value))}
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-right font-bold pr-12 outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">FCFA</span>
                            </div>
                            {errors.valorization_price && <p className="text-destructive text-[10px] font-bold">{errors.valorization_price}</p>}
                        </div>
                        
                        {/* Affichage de la valeur totale */}
                        <div className="flex flex-col justify-end bg-primary/5 rounded-lg border border-primary/20 p-3">
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1">
                                <Calculator className="w-3 h-3" /> Valeur Totale du Don
                            </span>
                            <span className="text-2xl font-black text-foreground text-right">
                                {totalValue.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">FCFA</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 rounded-xl">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                        <Info className="w-4 h-4 text-primary shrink-0" />
                        L'approbation de ce document générera une sortie de stock et une écriture comptable analytique.
                    </div>
                    <button
                        type="submit"
                        disabled={processing || data.quantity <= 0}
                        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3.5 rounded-xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Enregistrement...' : 'Valider le Don'}
                    </button>
                </div>
            </form>
        </div>
    );
}
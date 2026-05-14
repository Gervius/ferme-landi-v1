import React, { useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, 
    ArrowLeft, 
    ShoppingCart, 
    Plus, 
    Trash2, 
    Info, 
    Package, 
    BadgeEuro,
    Calculator
} from 'lucide-react';
import { saleOrdersIndex, saleOrdersStore } from '@/routes';

interface Props {
    customers: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    units: { id: number; name: string; symbol: string }[];
}

export default function CreateSaleOrder({ customers, categories, units }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        order_date: new Date().toISOString().split('T')[0],
        reference: `CMD-${Date.now().toString().slice(-6)}`, // Pré-remplissage simple
        items: [
            { category_id: '', unit_id: '', quantity: 1, unit_price: 0 }
        ],
    });

    const breadcrumbs = [
        { title: 'Ventes', href: '#' },
        { title: 'Commandes', href: saleOrdersIndex.url() },
        { title: 'Nouvelle Commande', href: '#' },
    ];

    // Calcul du montant total HT en temps réel
    const totalHT = useMemo(() => {
        return data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    }, [data.items]);

    const addItem = () => {
        setData('items', [...data.items, { category_id: '', unit_id: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(saleOrdersStore.url());
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Nouvelle Commande" />
            
            <div className="flex justify-between items-center">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={saleOrdersIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ENTÊTE DE COMMANDE */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-primary/5 flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Informations de la Commande</h2>
                            <p className="text-sm text-muted-foreground">Identifiez le client et les conditions de vente.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Client</label>
                            <select
                                value={data.customer_id}
                                onChange={e => setData('customer_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Sélectionner un client...</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.customer_id && <p className="text-destructive text-[10px] font-bold">{errors.customer_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Référence Commande</label>
                            <input
                                type="text"
                                value={data.reference}
                                onChange={e => setData('reference', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-mono font-bold"
                            />
                            {errors.reference && <p className="text-destructive text-[10px] font-bold">{errors.reference}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Date de commande</label>
                            <input
                                type="date"
                                value={data.order_date}
                                onChange={e => setData('order_date', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                            />
                            {errors.order_date && <p className="text-destructive text-[10px] font-bold">{errors.order_date}</p>}
                        </div>
                    </div>
                </div>

                {/* DÉTAIL DES ARTICLES (DYNAMIC TABLE) */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Package className="w-4 h-4 text-secondary" />
                            Articles commandés
                        </h3>
                        <button
                            type="button"
                            onClick={addItem}
                            className="bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                        >
                            <Plus className="w-4 h-4" /> Ajouter un produit
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/20 text-[10px] uppercase font-black text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 w-1/3">Produit (Catégorie)</th>
                                    <th className="px-4 py-3">Unité</th>
                                    <th className="px-4 py-3">Quantité</th>
                                    <th className="px-4 py-3">Prix Unitaire (FCFA)</th>
                                    <th className="px-4 py-3 text-right">Sous-total</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.items.map((item, index) => (
                                    <tr key={index} className="group hover:bg-primary/[0.02]">
                                        <td className="px-6 py-3">
                                            <select
                                                value={item.category_id}
                                                onChange={e => updateItem(index, 'category_id', e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground"
                                            >
                                                <option value="">Choisir produit...</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={item.unit_id}
                                                onChange={e => updateItem(index, 'unit_id', e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 text-sm"
                                            >
                                                <option value="">Unité...</option>
                                                {units.map(u => <option key={u.id} value={u.id}>{u.symbol}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                                className="w-20 bg-muted/30 border border-border rounded px-2 py-1 text-sm font-bold"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                                                className="w-28 bg-muted/30 border border-border rounded px-2 py-1 text-sm font-bold text-primary"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right font-black text-foreground">
                                            {(item.quantity * item.unit_price).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {data.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-muted-foreground hover:text-destructive transition p-1 opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* RÉSUMÉ FINANCIER */}
                    <div className="p-6 bg-muted/10 border-t border-border flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
                            <Info className="w-4 h-4 text-primary" />
                            Note : Les prix sont exprimés en Francs CFA (HT).
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total HT</p>
                                <p className="text-3xl font-black text-foreground">
                                    {totalHT.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">FCFA</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3.5 rounded-xl font-black transition-all shadow-xl shadow-primary/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Enregistrement...' : 'Enregistrer la commande'}
                    </button>
                </div>
            </form>
        </div>
    );
}
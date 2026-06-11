// pages/Purchases/PurchaseOrder/Create.tsx
import React, { useMemo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, ClipboardList, ArrowLeft, Layers, ShoppingBag } from 'lucide-react';
import { purchaseOrdersIndex, purchaseOrdersStore } from '@/routes';

interface SelectionItem { id: number; name: string; symbol?: string }

interface Props {
    suppliers: SelectionItem[];
    categories: SelectionItem[];
    units: SelectionItem[];
    sites?: SelectionItem[]; // Ajout défensif pour l'affectation du stock
}

interface OrderItem {
    category_id: string | number;
    unit_id: string | number;
    quantity: number;
    unit_price: number;
}

export default function Create({ suppliers, categories, units, sites = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        site_id: '',
        supplier_id: '',
        order_date: new Date().toISOString().split('T')[0],
        reference: '',
        items: [{ category_id: '', unit_id: '', quantity: 1, unit_price: 0 }] as OrderItem[],
    });

    // Gestion des lignes dynamiques
    const addItemLine = () => {
        setData('items', [...data.items, { category_id: '', unit_id: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItemLine = (index: number) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const updateItemLine = (index: number, field: keyof OrderItem, value: any) => {
        const updatedItems = data.items.map((item, i) => {
            if (i === index) return { ...item, [field]: value };
            return item;
        });
        setData('items', updatedItems);
    };

    // Optimisation RAM : Calcul automatique de la valeur totale de la commande
    const orderTotal = useMemo(() => {
        return data.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
    }, [data.items]);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(purchaseOrdersStore.url());
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background text-foreground">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={purchaseOrdersIndex.url()} className="hover:text-foreground flex items-center gap-1"><ArrowLeft size={14} /> Commandes</Link>
                <span>/</span><span className="text-foreground font-medium">Nouvel ordre</span>
            </div>

            <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardList className="text-secondary" /> Préparer un bon de commande</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Métadonnées de l'entête */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Référence Interne</label>
                        <input type="text" value={data.reference} onChange={e => setData('reference', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5" placeholder="Ex: BC-2026-001" />
                        {errors.reference && <span className="text-destructive text-xs">{errors.reference}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Fournisseur</label>
                        <select value={data.supplier_id} onChange={e => setData('supplier_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5">
                            <option value="">Sélectionner</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {errors.supplier_id && <span className="text-destructive text-xs">{errors.supplier_id}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Site de destination</label>
                        <select value={data.site_id} onChange={e => setData('site_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5">
                            <option value="">Sélectionner</option>
                            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {errors.site_id && <span className="text-destructive text-xs">{errors.site_id}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Date d'ordre</label>
                        <input type="date" value={data.order_date} onChange={e => setData('order_date', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5" />
                    </div>
                </div>

                {/* Table d'ajouts des articles */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><ShoppingBag size={16}/> Lignes de commande</span>
                        <button type="button" onClick={addItemLine} className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90">Ajouter un produit</button>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4">Désignation / Article</th>
                                <th className="p-4 w-44">Unité</th>
                                <th className="p-4 w-32 text-right">Quantité</th>
                                <th className="p-4 w-40 text-right">Prix Unitaire</th>
                                <th className="p-4 w-40 text-right">Sous-total</th>
                                <th className="p-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.items.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/10">
                                    <td className="p-3">
                                        <select value={item.category_id} onChange={e => updateItemLine(index, 'category_id', e.target.value)} className="w-full bg-input border border-border rounded-md p-2">
                                            <option value="">Sélectionner l'article</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <select value={item.unit_id} onChange={e => updateItemLine(index, 'unit_id', e.target.value)} className="w-full bg-input border border-border rounded-md p-2">
                                            <option value="">Unité</option>
                                            {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <input type="number" min="0.01" step="0.01" value={item.quantity} onChange={e => updateItemLine(index, 'quantity', Number(e.target.value))} className="w-full bg-input border border-border rounded-md p-2 text-right font-medium" />
                                    </td>
                                    <td className="p-3">
                                        <input type="number" min="0" value={item.unit_price} onChange={e => updateItemLine(index, 'unit_price', Number(e.target.value))} className="w-full bg-input border border-border rounded-md p-2 text-right font-medium" />
                                    </td>
                                    <td className="p-3 text-right font-bold text-card-foreground">
                                        {(item.quantity * item.unit_price).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">FCFA</span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button type="button" onClick={() => removeItemLine(index)} disabled={data.items.length === 1} className="text-muted-foreground hover:text-destructive disabled:opacity-30"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Bloc récapitulatif du total global */}
                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end">
                        <div className="text-right space-y-1">
                            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Montant Total de la commande</span>
                            <p className="text-3xl font-black text-foreground">{orderTotal.toLocaleString()} <span className="text-lg font-bold text-muted-foreground">FCFA</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href={purchaseOrdersIndex.url()} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</Link>
                    <button type="submit" disabled={processing} className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90">Enregistrer la commande</button>
                </div>
            </form>
        </div>
    );
}
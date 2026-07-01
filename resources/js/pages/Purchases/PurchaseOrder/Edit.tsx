// pages/Purchases/PurchaseOrder/Edit.tsx
import React, { useMemo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Trash2, ClipboardList, ArrowLeft, ShoppingBag } from 'lucide-react';
import { purchaseOrdersIndex, purchaseOrdersUpdate } from '@/routes';

interface FormItem {
    item_id: number | string; // Accepte les ID existants (number) et les nouveaux (string vide)
    unit_id: number | string;
    quantity: number;
    unit_price: number;
}

interface SelectionItem { id: number; name: string; symbol?: string }

interface BackendOrderItem {
    id: number;
    item_id: number;
    unit_id: number;
    quantity: string | number;
    unit_price: string | number;
}

interface PurchaseOrderProps {
    id: number;
    reference: string;
    order_date: string;
    supplier_id: number;
    site_id: number;
    items: BackendOrderItem[];
}

interface Props {
    purchaseOrder: PurchaseOrderProps;
    suppliers: SelectionItem[];
    items: SelectionItem[];
    units: SelectionItem[];
    sites?: SelectionItem[];
}

export default function Edit({ purchaseOrder, suppliers, items: catalogItems, units, sites = [] }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        site_id: purchaseOrder.site_id || '',
        supplier_id: purchaseOrder.supplier_id,
        order_date: purchaseOrder.order_date.split('T')[0],
        reference: purchaseOrder.reference,
        items: purchaseOrder.items.map(item => ({
            item_id: item.item_id, 
            unit_id: item.unit_id,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price)
        })) as FormItem[]
    });

    const addItemLine = () => {
        setData('items', [...data.items, { item_id: '', unit_id: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItemLine = (index: number) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const updateItemLine = (index: number, field: any, value: any) => {
        const updatedItems = data.items.map((item, i) => {
            if (i === index) return { ...item, [field]: value };
            return item;
        });
        setData('items', updatedItems);
    };

    const orderTotal = useMemo(() => {
        return data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    }, [data.items]);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        put(purchaseOrdersUpdate.url(purchaseOrder.id));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background text-foreground">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={purchaseOrdersIndex.url()} className="hover:text-foreground flex items-center gap-1"><ArrowLeft size={14} /> Commandes</Link>
                <span>/</span><span className="text-foreground font-medium">Modifier #{purchaseOrder.reference}</span>
            </div>

            <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardList className="text-secondary" /> Ajuster le bon de commande</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Référence Interne</label>
                        <input type="text" value={data.reference} onChange={e => setData('reference', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5" />
                        {errors.reference && <span className="text-destructive text-xs">{errors.reference}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Fournisseur</label>
                        <select value={data.supplier_id} onChange={e => setData('supplier_id', Number(e.target.value))} className="w-full bg-input border border-border rounded-lg p-2.5">
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Site de destination</label>
                        <select value={data.site_id} onChange={e => setData('site_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5">
                            <option value="">Sélectionner</option>
                            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Date d'ordre</label>
                        <input type="date" value={data.order_date} onChange={e => setData('order_date', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5" />
                    </div>
                </div>

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
                                        <select 
                                            value={item.item_id} 
                                            onChange={e => updateItemLine(index, 'item_id', Number(e.target.value))} 
                                            className="w-full bg-input border border-border rounded-md p-2"
                                        >
                                            <option value="">Sélectionner l'article</option>
                                            {/* Utilisation de l'alias pour éviter le conflit */}
                                            {catalogItems.map(catalogItem => (
                                                <option key={catalogItem.id} value={catalogItem.id}>
                                                    {catalogItem.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <select value={item.unit_id} onChange={e => updateItemLine(index, 'unit_id', Number(e.target.value))} className="w-full bg-input border border-border rounded-md p-2">
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

                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end">
                        <div className="text-right space-y-1">
                            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Montant Total de la commande</span>
                            <p className="text-3xl font-black text-foreground">{orderTotal.toLocaleString()} <span className="text-lg font-bold text-muted-foreground">FCFA</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href={purchaseOrdersIndex.url()} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</Link>
                    <button type="submit" disabled={processing} className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90">Mettre à jour la commande</button>
                </div>
            </form>
        </div>
    );
}
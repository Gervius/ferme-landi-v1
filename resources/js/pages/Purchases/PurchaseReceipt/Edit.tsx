// pages/Purchases/PurchaseReceipt/Edit.tsx
import React, { useMemo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Trash2, ArrowLeft, PackageOpen, ArrowDownToLine } from 'lucide-react';
import { purchaseReceiptsIndex, purchaseReceiptsUpdate } from '@/routes';

interface SelectionItem { id: number; name: string; symbol?: string; reference?: string }

interface BackendReceiptItem {
    id: number;
    purchase_order_item_id: number | null;
    category_id: number;
    unit_id: number;
    received_quantity: string | number;
}

interface PurchaseReceiptStructure {
    id: number;
    reference: string;
    receipt_date: string;
    purchase_order_id: number | null;
    site_id: number;
    items: BackendReceiptItem[];
}

interface Props {
    purchaseReceipt: PurchaseReceiptStructure;
    purchaseOrders: SelectionItem[];
    categories: SelectionItem[];
    units: SelectionItem[];
    sites?: SelectionItem[];
}

export default function Edit({ purchaseReceipt, purchaseOrders, categories, units, sites = [] }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        site_id: purchaseReceipt.site_id || '',
        purchase_order_id: purchaseReceipt.purchase_order_id || '',
        receipt_date: purchaseReceipt.receipt_date.split('T')[0],
        reference: purchaseReceipt.reference,
        items: purchaseReceipt.items.map(item => ({
            purchase_order_item_id: item.purchase_order_item_id,
            category_id: item.category_id,
            unit_id: item.unit_id,
            received_quantity: Number(item.received_quantity)
        }))
    });

    const addLine = () => {
        setData('items', [...data.items, { purchase_order_item_id: null, category_id: '', unit_id: '', received_quantity: 1 }]);
    };

    const removeLine = (index: number) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const updateLine = (index: number, field: any, value: any) => {
        const updatedItems = data.items.map((item, i) => {
            if (i === index) return { ...item, [field]: value };
            return item;
        });
        setData('items', updatedItems);
    };

    const totalItemsCount = useMemo(() => {
        return data.items.reduce((sum, item) => sum + Number(item.received_quantity || 0), 0);
    }, [data.items]);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        put(purchaseReceiptsUpdate.url(purchaseReceipt.id));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background text-foreground">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={purchaseReceiptsIndex.url()} className="hover:text-foreground flex items-center gap-1">
                    <ArrowLeft size={14} /> Réceptions
                </Link>
                <span>/</span><span className="text-foreground font-medium">Modifier #{purchaseReceipt.reference}</span>
            </div>

            <h1 className="text-2xl font-bold flex items-center gap-2">
                <PackageOpen className="text-secondary" /> Ajuster le Bon de Réception
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Numéro de Réception / BL</label>
                        <input type="text" value={data.reference} onChange={e => setData('reference', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5" />
                        {errors.reference && <span className="text-destructive text-xs font-medium">{errors.reference}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Commande d'Achat d'Origine</label>
                        <select value={data.purchase_order_id} onChange={e => setData('purchase_order_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 text-sm">
                            <option value="">Achat direct (Sans bon de commande)</option>
                            {purchaseOrders.map(po => <option key={po.id} value={po.id}>{po.reference}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Magasin de stockage</label>
                        <select value={data.site_id} onChange={e => setData('site_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 text-sm">
                            <option value="">Sélectionner</option>
                            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {errors.site_id && <span className="text-destructive text-xs font-medium">{errors.site_id}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Date de réception</label>
                        <input type="date" value={data.receipt_date} onChange={e => setData('receipt_date', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5" />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <ArrowDownToLine size={16}/> Lignes matérielles à rectifier
                        </span>
                        <button type="button" onClick={addLine} className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90">
                            Ajouter une ligne
                        </button>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4">Article</th>
                                <th className="p-4 w-48">Unité</th>
                                <th className="p-4 w-48 text-right">Quantité Réceptionnée</th>
                                <th className="p-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.items.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/10">
                                    <td className="p-3">
                                        <select value={item.category_id} onChange={e => updateLine(index, 'category_id', Number(e.target.value))} className="w-full bg-input border border-border rounded-md p-2">
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <select value={item.unit_id} onChange={e => updateLine(index, 'unit_id', Number(e.target.value))} className="w-full bg-input border border-border rounded-md p-2">
                                            {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <input type="number" min="0.01" step="0.01" value={item.received_quantity} onChange={e => updateLine(index, 'received_quantity', Number(e.target.value))} className="w-full bg-input border border-border rounded-md p-2 text-right font-bold text-secondary" />
                                    </td>
                                    <td className="p-3 text-center">
                                        <button type="button" onClick={() => removeLine(index)} disabled={data.items.length === 1} className="text-muted-foreground hover:text-destructive disabled:opacity-30 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
                        <p className="text-sm font-semibold text-muted-foreground">
                            Volume total rectifié : <span className="text-foreground font-black">{totalItemsCount.toLocaleString()} units</span>
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href={purchaseReceiptsIndex.url()} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</Link>
                    <button type="submit" disabled={processing} className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90">
                        Sauvegarder les modifications
                    </button>
                </div>
            </form>
        </div>
    );
}
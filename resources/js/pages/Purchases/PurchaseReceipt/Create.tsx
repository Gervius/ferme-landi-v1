// pages/Purchases/PurchaseReceipt/Create.tsx
import React, { useMemo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, ArrowLeft, PackageOpen, ArrowDownToLine } from 'lucide-react';
import { purchaseReceiptsIndex, purchaseReceiptsStore } from '@/routes';

interface SelectionItem { id: number; name: string; symbol?: string; reference?: string }

interface Props {
    purchaseOrders: SelectionItem[]; // Commandes en attente de livraison
    categories: SelectionItem[];     // Liste des articles
    units: SelectionItem[];          // Référentiel des unités
    sites?: SelectionItem[];         // Entrepôts/Fermes de stockage
}

interface ReceiptItem {
    purchase_order_item_id: string | number | null;
    category_id: string | number;
    unit_id: string | number;
    received_quantity: number;
}

export default function Create({ purchaseOrders, categories, units, sites = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        site_id: '',
        purchase_order_id: '',
        receipt_date: new Date().toISOString().split('T')[0],
        reference: '',
        items: [{ purchase_order_item_id: null, category_id: '', unit_id: '', received_quantity: 1 }] as ReceiptItem[],
    });

    // Insertion et suppression dynamique de lignes
    const addLine = () => {
        setData('items', [...data.items, { purchase_order_item_id: null, category_id: '', unit_id: '', received_quantity: 1 }]);
    };

    const removeLine = (index: number) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const updateLine = (index: number, field: keyof ReceiptItem, value: any) => {
        const updatedItems = data.items.map((item, i) => {
            if (i === index) return { ...item, [field]: value };
            return item;
        });
        setData('items', updatedItems);
    };

    // Performance (RAM) : Cumul des quantités totales livrées calculé à la volée
    const totalItemsCount = useMemo(() => {
        return data.items.reduce((sum, item) => sum + Number(item.received_quantity || 0), 0);
    }, [data.items]);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(purchaseReceiptsStore.url());
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background text-foreground">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={purchaseReceiptsIndex.url()} className="hover:text-foreground flex items-center gap-1">
                    <ArrowLeft size={14} /> Réceptions
                </Link>
                <span>/</span><span className="text-foreground font-medium">Nouveau bon d'entrée</span>
            </div>

            <h1 className="text-2xl font-bold flex items-center gap-2">
                <PackageOpen className="text-secondary" /> Créer un Bon de Réception de Matériel
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Informations logistiques générales */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Numéro de Réception / BL</label>
                        <input 
                            type="text" 
                            value={data.reference} 
                            onChange={e => setData('reference', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5" 
                            placeholder="Ex: BR-2026-0001" 
                        />
                        {errors.reference && <span className="text-destructive text-xs font-medium">{errors.reference}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Associer à une Commande d'Achat (Optionnel)</label>
                        <select 
                            value={data.purchase_order_id} 
                            onChange={e => setData('purchase_order_id', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5 text-sm"
                        >
                            <option value="">Achat direct (Sans bon de commande)</option>
                            {purchaseOrders.map(po => <option key={po.id} value={po.id}>{po.reference}</option>)}
                        </select>
                        {errors.purchase_order_id && <span className="text-destructive text-xs font-medium">{errors.purchase_order_id}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Magasin / Site de stockage d'arrivée</label>
                        <select 
                            value={data.site_id} 
                            onChange={e => setData('site_id', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5 text-sm"
                        >
                            <option value="">Sélectionner le dépôt de destination</option>
                            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {errors.site_id && <span className="text-destructive text-xs font-medium">{errors.site_id}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Date d'entrée en soute</label>
                        <input 
                            type="date" 
                            value={data.receipt_date} 
                            onChange={e => setData('receipt_date', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5" 
                        />
                        {errors.receipt_date && <span className="text-destructive text-xs font-medium">{errors.receipt_date}</span>}
                    </div>
                </div>

                {/* Grille de déchargement des marchandises */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <ArrowDownToLine size={16}/> Colis et volumes réceptionnés
                        </span>
                        <button 
                            type="button" 
                            onClick={addLine} 
                            className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-2 rounded-lg hover:opacity-90"
                        >
                            Ajouter une ligne
                        </button>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4">Article / Produit reçu</th>
                                <th className="p-4 w-48">Conditionnement / Unité</th>
                                <th className="p-4 w-48 text-right">Quantité Physiquement Reçue</th>
                                <th className="p-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.items.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/10">
                                    <td className="p-3">
                                        <select 
                                            value={item.category_id} 
                                            onChange={e => updateLine(index, 'category_id', e.target.value)} 
                                            className="w-full bg-input border border-border rounded-md p-2"
                                        >
                                            <option value="">Sélectionner l'article</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        {errors[`items.${index}.category_id` as keyof typeof errors] && (
                                            <span className="text-destructive text-xs block mt-0.5">Requis</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <select 
                                            value={item.unit_id} 
                                            onChange={e => updateLine(index, 'unit_id', e.target.value)} 
                                            className="w-full bg-input border border-border rounded-md p-2"
                                        >
                                            <option value="">Sélectionner l'unité</option>
                                            {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                                        </select>
                                        {errors[`items.${index}.unit_id` as keyof typeof errors] && (
                                            <span className="text-destructive text-xs block mt-0.5">Requis</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <input 
                                            type="number" 
                                            min="0.01" 
                                            step="0.01" 
                                            value={item.received_quantity || ''} 
                                            onChange={e => updateLine(index, 'received_quantity', Number(e.target.value))} 
                                            className="w-full bg-input border border-border rounded-md p-2 text-right font-bold text-secondary" 
                                        />
                                        {errors[`items.${index}.received_quantity` as keyof typeof errors] && (
                                            <span className="text-destructive text-xs block mt-0.5">Invalide</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button 
                                            type="button" 
                                            onClick={() => removeLine(index)} 
                                            disabled={data.items.length === 1} 
                                            className="text-muted-foreground hover:text-destructive disabled:opacity-30 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
                        <p className="text-sm font-semibold text-muted-foreground">
                            Volume total cumulé sur ce bon : <span className="text-foreground font-black">{totalItemsCount.toLocaleString()} units</span>
                        </p>
                    </div>
                </div>

                {/* Boutons d'enregistrements */}
                <div className="flex justify-end gap-4">
                    <Link href={purchaseReceiptsIndex.url()} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Annuler
                    </Link>
                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        Créer le Bon de Réception (Draft)
                    </button>
                </div>
            </form>
        </div>
    );
}
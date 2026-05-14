import React, { useEffect, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, 
    ArrowLeft, 
    PackageOpen, 
    Plus, 
    Trash2, 
    Info,
    Loader2
} from 'lucide-react';
import { purchaseReceiptsIndex, purchaseReceiptsStore } from '@/routes';
import axios from 'axios';

interface Props {
    purchaseOrders: { id: number; reference: string }[];
    categories: { id: number; name: string }[];
    units: { id: number; name: string; symbol: string }[];
}

export default function CreatePurchaseReceipt({ purchaseOrders, categories, units }: Props) {
    const [isLoadingItems, setIsLoadingItems] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        purchase_order_id: '',
        receipt_date: new Date().toISOString().split('T')[0],
        reference: `BR-${Date.now().toString().slice(-6)}`,
        items: [
            { purchase_order_item_id: '', category_id: '', unit_id: '', received_quantity: 0 }
        ],
    });

    const breadcrumbs = [
        { title: 'Achats', href: '#' },
        { title: 'Réceptions', href: purchaseReceiptsIndex.url() },
        { title: 'Nouvel Arrivage', href: '#' },
    ];

    // --- LOGIQUE D'AUTO-REMPLISSAGE VIA L'API DE JULES ---
    useEffect(() => {
        if (!data.purchase_order_id) return;

        const fetchOrderDetails = async () => {
            setIsLoadingItems(true);
            try {
                // Appel vers la nouvelle route API de Jules
                const response = await axios.get(`/api/purchase-orders/${data.purchase_order_id}`);
                const order = response.data;

                // Mappage des items de la commande vers le bon de réception
                const newItems = order.items.map((item: any) => ({
                    purchase_order_item_id: item.id,
                    category_id: item.category_id,
                    unit_id: item.unit_id,
                    received_quantity: item.quantity, // Par défaut, on suppose qu'il reçoit tout (il peut modifier)
                }));

                setData('items', newItems);
            } catch (error) {
                console.error("Erreur lors de la récupération de la commande", error);
            } finally {
                setIsLoadingItems(false);
            }
        };

        fetchOrderDetails();
    }, [data.purchase_order_id]);

    const addItem = () => {
        setData('items', [...data.items, { purchase_order_item_id: '', category_id: '', unit_id: '', received_quantity: 0 }]);
    };

    const removeItem = (index: number) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    // Utilisation stricte de React.SubmitEvent comme tu l'as précisé
    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(purchaseReceiptsStore.url());
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Nouveau Bon de Réception" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={purchaseReceiptsIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-emerald-500/5 flex items-center gap-3">
                        <PackageOpen className="w-6 h-6 text-emerald-600" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Réception de Marchandises</h2>
                            <p className="text-sm text-muted-foreground">Enregistrez l'arrivée physique des produits dans l'entrepôt.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Lier à une commande</label>
                            <select
                                value={data.purchase_order_id}
                                onChange={e => setData('purchase_order_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-primary"
                            >
                                <option value="">--- Réception Libre ---</option>
                                {purchaseOrders.map(po => <option key={po.id} value={po.id}>{po.reference}</option>)}
                            </select>
                            {errors.purchase_order_id && <p className="text-destructive text-[10px] font-bold">{errors.purchase_order_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Réf. Bon de Réception</label>
                            <input
                                type="text"
                                value={data.reference}
                                onChange={e => setData('reference', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-mono font-bold"
                            />
                            {errors.reference && <p className="text-destructive text-[10px] font-bold">{errors.reference}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Date d'arrivée</label>
                            <input
                                type="date"
                                value={data.receipt_date}
                                onChange={e => setData('receipt_date', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                            />
                            {errors.receipt_date && <p className="text-destructive text-[10px] font-bold">{errors.receipt_date}</p>}
                        </div>
                    </div>
                </div>

                {/* TABLEAU DES ARTICLES */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden relative">
                    {/* Overlay de chargement pendant l'appel API */}
                    {isLoadingItems && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                                <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Extraction de la commande...</span>
                            </div>
                        </div>
                    )}

                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center text-sm font-bold">
                        <span className="uppercase tracking-widest text-muted-foreground">Articles Réceptionnés</span>
                        <button type="button" onClick={addItem} className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition">
                            <Plus className="w-4 h-4" /> Ajouter ligne
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/10 text-[10px] uppercase font-black text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-6 py-3">Produit (Catégorie)</th>
                                    <th className="px-4 py-3">Unité de mesure</th>
                                    <th className="px-4 py-3 text-center">Quantité Réelle Reçue</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.items.map((item, index) => (
                                    <tr key={index} className="group hover:bg-muted/5">
                                        <td className="px-6 py-3">
                                            <select
                                                value={item.category_id}
                                                onChange={e => updateItem(index, 'category_id', e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 font-bold"
                                            >
                                                <option value="">Sélectionner...</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={item.unit_id}
                                                onChange={e => updateItem(index, 'unit_id', e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 text-muted-foreground"
                                            >
                                                <option value="">Unité...</option>
                                                {units.map(u => <option key={u.id} value={u.id}>{u.symbol}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={item.received_quantity}
                                                onChange={e => updateItem(index, 'received_quantity', Number(e.target.value))}
                                                className="w-32 mx-auto bg-muted/30 border border-border rounded px-3 py-2 font-black text-emerald-600 text-center focus:bg-background focus:ring-2 focus:ring-emerald-500/20 outline-none"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {data.items.length > 1 && (
                                                <button type="button" onClick={() => removeItem(index)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-6 bg-muted/20 rounded-xl border border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                        <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                        L'approbation de ce bon ajoutera les quantités au stock d'inventaire disponible.
                    </div>
                    <button
                        type="submit"
                        disabled={processing || isLoadingItems}
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-3.5 rounded-xl font-black shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Génération...' : 'Créer le Bon de Réception'}
                    </button>
                </div>
            </form>
        </div>
    );
}
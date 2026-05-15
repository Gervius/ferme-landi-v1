import React, { useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, 
    ArrowLeft, 
    ClipboardList, 
    Plus, 
    Trash2, 
    Info, 
    Package, 
    Calculator
} from 'lucide-react';
import { purchaseOrdersIndex, purchaseOrdersStore } from '@/routes';

interface Props {
    suppliers: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    units: { id: number; name: string; symbol: string }[];
}

export default function CreatePurchaseOrder({ suppliers, categories, units }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        order_date: new Date().toISOString().split('T')[0],
        reference: `BCA-${Date.now().toString().slice(-6)}`,
        items: [
            { category_id: '', unit_id: '', quantity: 1, unit_price: 0 }
        ],
    });

    const breadcrumbs = [
        { title: 'Achats', href: '#' },
        { title: 'Commandes', href: purchaseOrdersIndex.url() },
        { title: 'Nouveau Bon', href: '#' },
    ];

    // Calcul dynamique du montant total prévisionnel
    const totalAchatHT = useMemo(() => {
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

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(purchaseOrdersStore.url());
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Nouveau Bon d'Achat" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={purchaseOrdersIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* BLOC : ENTÊTE DE COMMANDE */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-primary/5 flex items-center gap-3">
                        <ClipboardList className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Bon de Commande d'Achat (BCA)</h2>
                            <p className="text-sm text-muted-foreground italic">Détaillez vos besoins d'approvisionnement auprès du fournisseur.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-muted-foreground tracking-tighter">Fournisseur Partenaire</label>
                            <select
                                value={data.supplier_id}
                                onChange={e => setData('supplier_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition font-bold"
                            >
                                <option value="">--- Sélectionner Fournisseur ---</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.supplier_id && <p className="text-destructive text-[10px] font-bold">{errors.supplier_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-muted-foreground tracking-tighter">Référence Interne</label>
                            <input
                                type="text"
                                value={data.reference}
                                onChange={e => setData('reference', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-mono font-bold"
                            />
                            {errors.reference && <p className="text-destructive text-[10px] font-bold">{errors.reference}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black uppercase text-muted-foreground tracking-tighter">Date de la commande</label>
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

                {/* BLOC : DÉTAIL DES ARTICLES COMMANDÉS */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <h3 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-widest">
                            <Package className="w-4 h-4 text-secondary" />
                            Articles à commander
                        </h3>
                        <button
                            type="button"
                            onClick={addItem}
                            className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition"
                        >
                            <Plus className="w-4 h-4" /> Ajouter un produit
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead className="bg-muted/20 text-[10px] uppercase font-black text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 w-1/3">Produit (Catégorie)</th>
                                    <th className="px-4 py-3">Unité</th>
                                    <th className="px-4 py-3 text-center">Quantité</th>
                                    <th className="px-4 py-3">P.U Achat (FCFA)</th>
                                    <th className="px-4 py-3 text-right">Sous-total</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.items.map((item, index) => (
                                    <tr key={index} className="group hover:bg-muted/10">
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
                                                value={item.quantity}
                                                onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                                className="w-20 mx-auto bg-muted/30 border border-border rounded px-2 py-1 font-bold text-center"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                                                className="w-28 bg-muted/30 border border-border rounded px-2 py-1 font-black text-secondary-foreground text-right"
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

                    <div className="p-6 bg-muted/10 border-t border-border flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
                            <Info className="w-4 h-4 text-primary" />
                            Montant estimé de la facture fournisseur à réception.
                        </div>
                        <div className="text-right flex items-center gap-6">
                            <Calculator className="w-8 h-8 text-primary opacity-20" />
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Estimé HT</p>
                                <p className="text-3xl font-black text-foreground">
                                    {totalAchatHT.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">FCFA</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3.5 rounded-xl font-black transition-all shadow-xl shadow-primary/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Enregistrement...' : 'Valider le Bon de Commande'}
                    </button>
                </div>
            </form>
        </div>
    );
}
import React, { useMemo } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, ArrowLeft, ShoppingCart, Plus, Trash2, Info, Package
} from 'lucide-react';

interface ItemResource {
    id: number;
    name: string;
    category: { id: number; name: string };
    default_unit: { id: number; symbol: string };
}

interface Props {
    customers: { id: number; name: string }[];
    items: ItemResource[];
}

export default function CreateSaleOrder({ customers, items }: Props) {
    const { auth } = usePage<any>().props;
    
    const { data, setData, post, processing, errors, transform } = useForm({
        site_id: auth.user.current_site_id,
        customer_id: '',
        order_date: new Date().toISOString().split('T')[0],
        items: [
            { item_id: '', quantity: 1, unit_price: 0 }
        ],
    });

    const getLineError = (index: number, field: string) => {
        return errors[`items.${index}.${field}` as keyof typeof errors];
    };

    const breadcrumbs = [
        { title: 'Ventes', href: '#' },
        { title: 'Commandes', href: '/sales/sale-orders' },
        { title: 'Nouvelle Commande', href: '#' },
    ];

    const totalHT = useMemo(() => {
        // On travaille en entiers (FCFA brut). Si tu veux gérer les centimes, multiplie par 100
        return data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    }, [data.items]);

    const addItem = () => {
        setData('items', [...data.items, { item_id: '', quantity: 1, unit_price: 0 }]);
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

        // 1. On transforme les données courantes juste avant l'envoi
        transform((currentData) => ({
            ...currentData,
            items: currentData.items.map(item => ({
                ...item,
                // Sécurité mathématique : Entiers stricts
                quantity: Math.round(item.quantity),
                unit_price: Math.round(item.unit_price)
            }))
        }));

        // 2. On lance le post normalement, il utilisera les données transformées
        post('/sales/sale-orders');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Nouvelle Commande" />
            
            <div className="flex justify-between items-center">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href="/sales/sale-orders" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-bold">
                        Certaines lignes ou certains champs contiennent des erreurs de saisie. Veuillez vérifier les éléments indiqués en rouge.
                    </div>
                )}

                {/* ENTÊTE DE COMMANDE */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-primary/5 flex items-center gap-3">
                        <ShoppingCart className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Informations de la Commande</h2>
                            <p className="text-sm text-muted-foreground">Identifiez le client et les conditions de vente.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* DÉTAIL DES ARTICLES */}
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
                                    <th className="px-6 py-3 w-1/3">Produit (Physique)</th>
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
                                        <td className="px-6 py-3 border-b border-border align-top">
                                            <select
                                                value={item.item_id}
                                                onChange={e => updateItem(index, 'item_id', e.target.value)}
                                                className={`w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-foreground ${getLineError(index, 'item_id') ? 'text-destructive' : ''}`}
                                            >
                                                <option value="">Choisir produit...</option>
                                                {items.map(i => (
                                                    <option key={i.id} value={i.id}>
                                                        {i.name} ({i.category?.name})
                                                    </option>
                                                ))}
                                            </select>
                                            {getLineError(index, 'item_id') && (
                                                <p className="text-destructive text-[10px] font-bold mt-1 px-1">{getLineError(index, 'item_id')}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 border-b border-border align-top pt-4 text-sm font-medium text-muted-foreground">
                                            {item.item_id ? items.find(i => i.id === Number(item.item_id))?.default_unit?.symbol || '-' : '-'}
                                        </td>
                                        <td className="px-4 py-3 border-b border-border align-top">
                                            <input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={item.quantity}
                                                onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                                className={`w-20 bg-muted/30 border rounded px-2 py-1 text-sm font-bold text-right ${getLineError(index, 'quantity') ? 'border-destructive' : 'border-border'}`}
                                            />
                                            {getLineError(index, 'quantity') && (
                                                <p className="text-destructive text-[10px] font-bold mt-1 text-right">{getLineError(index, 'quantity')}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 border-b border-border align-top">
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                                                className={`w-28 bg-muted/30 border rounded px-2 py-1 text-sm font-bold text-primary text-right ${getLineError(index, 'unit_price') ? 'border-destructive' : 'border-border'}`}
                                            />
                                            {getLineError(index, 'unit_price') && (
                                                <p className="text-destructive text-[10px] font-bold mt-1 text-right">{getLineError(index, 'unit_price')}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-black text-foreground border-b border-border align-top pt-4">
                                            {(item.quantity * item.unit_price).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-right border-b border-border align-top pt-4">
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
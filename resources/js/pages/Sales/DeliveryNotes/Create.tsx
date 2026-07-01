import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, ArrowLeft, Truck, Plus, Trash2, Package, Info
} from 'lucide-react';

interface ItemResource {
    id: number;
    name: string;
    category: { id: number; name: string };
    default_unit: { id: number; symbol: string };
}

interface Props {
    saleOrders: { id: number; reference: string }[];
    items: ItemResource[]; // Remplacement de categories et units
}

export default function CreateDeliveryNote({ saleOrders, items }: Props) {
    const { auth } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        site_id: auth.user.current_site_id, // Injecté silencieusement
        sale_order_id: '',
        delivery_date: new Date().toISOString().split('T')[0],
        items: [
            { item_id: '', delivered_quantity: 1 } // Pointage physique direct
        ],
    });

    const getLineError = (index: number, field: string) => {
        return errors[`items.${index}.${field}` as keyof typeof errors];
    };

    const breadcrumbs = [
        { title: 'Ventes', href: '#' },
        { title: 'Livraisons', href: '/sales/delivery-notes' },
        { title: 'Créer Bon', href: '#' },
    ];

    const addItem = () => {
        setData('items', [...data.items, { item_id: '', delivered_quantity: 1 }]);
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
        post('/sales/delivery-notes');
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Nouveau Bon de Livraison" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href="/sales/delivery-notes" className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-bold">
                        Certaines lignes ou certains champs contiennent des erreurs de saisie. Veuillez vérifier les éléments indiqués en rouge.
                    </div>
                )}
                
                {/* Entête du BL */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-secondary/5 flex items-center gap-3">
                        <Truck className="w-6 h-6 text-secondary" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Expédition de Marchandises</h2>
                            <p className="text-sm text-muted-foreground">Renseignez les détails de la sortie de stock.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Lier à une Commande (Optionnel)</label>
                            <select
                                value={data.sale_order_id}
                                onChange={e => setData('sale_order_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-secondary/20"
                            >
                                <option value="">Livraison libre (sans commande)</option>
                                {saleOrders.map(so => <option key={so.id} value={so.id}>{so.reference}</option>)}
                            </select>
                            {errors.sale_order_id && <p className="text-destructive text-[10px] font-bold">{errors.sale_order_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Date de livraison</label>
                            <input
                                type="date"
                                value={data.delivery_date}
                                onChange={e => setData('delivery_date', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                            />
                            {errors.delivery_date && <p className="text-destructive text-[10px] font-bold">{errors.delivery_date}</p>}
                        </div>
                    </div>
                </div>

                {/* Tableau des articles livrés */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center text-sm font-bold">
                        <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Articles à déstocker</span>
                        <button type="button" onClick={addItem} className="text-secondary hover:underline flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Ajouter une ligne
                        </button>
                    </div>

                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-muted/10 text-[10px] uppercase font-bold text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-6 py-3 w-1/2">Produit (Physique)</th>
                                <th className="px-4 py-3">Unité</th>
                                <th className="px-4 py-3">Quantité Livrée</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-3 border-b border-border align-top">
                                        <select
                                            value={item.item_id}
                                            onChange={e => updateItem(index, 'item_id', e.target.value)}
                                            className={`w-full bg-transparent border-none focus:ring-0 font-semibold ${getLineError(index, 'item_id') ? 'text-destructive' : ''}`}
                                        >
                                            <option value="">Sélectionner un produit...</option>
                                            {items?.map(i => (
                                                <option key={i.id} value={i.id}>
                                                    {i.name} ({i.category?.name})
                                                </option>
                                            ))}
                                        </select>
                                        {getLineError(index, 'item_id') && (
                                            <p className="text-destructive text-[10px] font-bold mt-1 px-1">{getLineError(index, 'item_id')}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 border-b border-border align-top pt-4 text-muted-foreground font-medium">
                                        {/* Affichage automatique de l'unité liée au produit sélectionné */}
                                        {item.item_id ? items.find(i => i.id === Number(item.item_id))?.default_unit?.symbol || '-' : '-'}
                                    </td>
                                    <td className="px-4 py-3 border-b border-border align-top">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={item.delivered_quantity}
                                            onChange={e => updateItem(index, 'delivered_quantity', Number(e.target.value))}
                                            className={`w-24 bg-muted/30 border rounded px-2 py-1 font-bold text-secondary-foreground text-right ${getLineError(index, 'delivered_quantity') ? 'border-destructive' : 'border-border'}`}
                                        />
                                        {getLineError(index, 'delivered_quantity') && (
                                            <p className="text-destructive text-[10px] font-bold mt-1 text-right">{getLineError(index, 'delivered_quantity')}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 border-b border-border align-top pt-4">
                                        {data.items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(index)} className="text-muted-foreground hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-muted/20 rounded-xl border border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                        <Info className="w-4 h-4 text-primary" />
                        L'approbation de ce bon générera automatiquement un mouvement de stock négatif.
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full md:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground px-12 py-3 rounded-lg font-black shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Génération...' : 'Créer le Bon de Livraison'}
                    </button>
                </div>
            </form>
        </div>
    );
}
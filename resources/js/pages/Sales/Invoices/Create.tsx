import React, { useMemo, useEffect, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, ArrowLeft, FileText, Plus, Trash2, Info, Calculator, Loader2 
} from 'lucide-react';
import { invoicesIndex, invoicesStore } from '@/routes';
import axios from 'axios';

interface Props {
    customers: { id: number; name: string }[];
    deliveryNotes: { id: number; reference: string }[];
}

export default function CreateInvoice({ customers, deliveryNotes }: Props) {
    const [isLoadingItems, setIsLoadingItems] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        delivery_note_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reference: `FACT-${Date.now().toString().slice(-6)}`,
        items: [
            { delivery_note_item_id: '', description: '', quantity: 0, unit_price: 0 }
        ],
    });

    const getLineError = (index: number, field: string) => {
        return errors[`items.${index}.${field}` as keyof typeof errors];
    };

    // --- LOGIQUE D'AUTO-REMPLISSAGE ---
    useEffect(() => {
        if (!data.delivery_note_id) return;

        const fetchBLDetails = async () => {
            setIsLoadingItems(true);
            try {
                // Appel à l'API pour récupérer les lignes du BL
                const response = await axios.get(`/api/delivery-notes/${data.delivery_note_id}`);
                const bl = response.data;

                // On mappe les lignes du BL vers la structure de la facture
                const newItems = bl.items.map((item: any) => ({
                    delivery_note_item_id: item.id,
                    description: `${item.category.name} (Livraison ${bl.reference})`,
                    quantity: item.delivered_quantity,
                    unit_price: 0, // Le comptable n'a plus qu'à saisir le prix
                }));

                setData(prev => ({
                    ...prev,
                    items: newItems,
                    customer_id: bl.sale_order?.customer_id || prev.customer_id // On lie aussi le client si possible
                }));
            } catch (error) {
                console.error("Erreur lors de la récupération du BL", error);
            } finally {
                setIsLoadingItems(false);
            }
        };

        fetchBLDetails();
    }, [data.delivery_note_id]);

    const totalAmount = useMemo(() => {
        return data.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    }, [data.items]);

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(invoicesStore.url());
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Création Facture" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={[
                    { title: 'Ventes', href: '#' },
                    { title: 'Facturation', href: invoicesIndex.url() },
                    { title: 'Éditer Facture', href: '#' }
                ]} />
                <Link href={invoicesIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-bold">
                        Certaines lignes ou certains champs contiennent des erreurs de saisie. Veuillez vérifier les éléments indiqués en rouge.
                    </div>
                )}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-primary/5 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Édition de Facture Client</h2>
                            <p className="text-sm text-muted-foreground italic">Sélectionnez un BL pour charger automatiquement les lignes.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1.5 lg:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter italic">Bon de Livraison Source</label>
                            <select
                                value={data.delivery_note_id}
                                onChange={e => setData('delivery_note_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none font-bold text-secondary focus:ring-2 focus:ring-secondary/20"
                            >
                                <option value="">--- Choisir un Bon de Livraison ---</option>
                                {deliveryNotes.map(dn => <option key={dn.id} value={dn.id}>{dn.reference}</option>)}
                            </select>
                            {errors.delivery_note_id && <p className="text-destructive text-[10px] font-bold">{errors.delivery_note_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Client Facturé</label>
                            <select
                                value={data.customer_id}
                                onChange={e => setData('customer_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                            >
                                <option value="">Sélectionner le client...</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.customer_id && <p className="text-destructive text-[10px] font-bold">{errors.customer_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Réf. Facture</label>
                            <input type="text" value={data.reference} onChange={e => setData('reference', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-mono font-bold" />
                            {errors.reference && <p className="text-destructive text-[10px] font-bold">{errors.reference}</p>}
                        </div>

                        <div className="space-y-1.5 lg:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Date d'émission</label>
                            <input type="date" value={data.invoice_date} onChange={e => setData('invoice_date', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none" />
                        </div>

                        <div className="space-y-1.5 lg:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Échéance de paiement</label>
                            <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-destructive/20" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden relative">
                    {/* Overlay de chargement */}
                    {isLoadingItems && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                <span className="text-xs font-bold uppercase text-muted-foreground">Chargement des lignes du BL...</span>
                            </div>
                        </div>
                    )}

                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <h3 className="font-bold text-foreground text-sm uppercase tracking-widest">Détails de la Facture</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/20 text-[10px] uppercase font-black text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-6 py-3">Description du Produit / Service</th>
                                    <th className="px-4 py-3 text-center">Qté Livrée</th>
                                    <th className="px-4 py-3">Prix Unitaire (FCFA)</th>
                                    <th className="px-4 py-3 text-right">Sous-total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.items.map((item, index) => (
                                    <tr key={index} className="group">
                                        <td className="px-6 py-3 border-b border-border align-top">
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={e => updateItem(index, 'description', e.target.value)}
                                                className={`w-full bg-transparent border-none focus:ring-0 text-sm font-semibold italic text-muted-foreground ${getLineError(index, 'description') ? 'text-destructive border-b border-destructive' : ''}`}
                                            />
                                            {getLineError(index, 'description') && (
                                                <p className="text-destructive text-[10px] font-bold mt-1 px-1">{getLineError(index, 'description')}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-foreground border-b border-border align-top pt-4">
                                            {item.quantity}
                                            {getLineError(index, 'quantity') && (
                                                <p className="text-destructive text-[10px] font-bold mt-1">{getLineError(index, 'quantity')}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 border-b border-border align-top">
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                                                className={`w-full bg-muted/30 border border-border rounded px-2 py-1.5 text-sm font-black text-primary text-right focus:bg-background ${getLineError(index, 'unit_price') ? 'border-destructive' : 'border-border'}`}
                                                placeholder="Saisir prix..."
                                            />
                                            {getLineError(index, 'unit_price') && (
                                                <p className="text-destructive text-[10px] font-bold mt-1 text-right">{getLineError(index, 'unit_price')}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-black text-foreground border-b border-border align-top pt-4">
                                            {(item.quantity * item.unit_price).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-muted/10 border-t border-border flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
                            <Info className="w-4 h-4 text-primary" />
                            Vérifiez les prix unitaires avant de générer la facture.
                        </div>
                        <div className="text-right flex items-center gap-4">
                            <Calculator className="w-8 h-8 text-primary opacity-20" />
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">NET À PAYER</p>
                                <p className="text-3xl font-black text-foreground">
                                    {totalAmount.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">FCFA</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={processing || isLoadingItems || data.items[0].quantity === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3.5 rounded-xl font-black shadow-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                        <Save className="w-5 h-5" />
                        {processing ? 'Enregistrement...' : 'Émettre la Facture'}
                    </button>
                </div>
            </form>
        </div>
    );
}
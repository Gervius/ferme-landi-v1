import React, { useEffect, useState, useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, ArrowLeft, FileText, Plus, Trash2, Info, Calculator, Loader2 
} from 'lucide-react';
// Adapte l'import selon tes variables de routes réelles
import { supplierInvoicesIndex, supplierInvoicesStore } from '@/routes';
import axios from 'axios';

interface Props {
    suppliers: { id: number; name: string }[];
    receipts: { id: number; reference: string }[];
}

export default function CreateSupplierInvoice({ suppliers, receipts }: Props) {
    const [isLoadingItems, setIsLoadingItems] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        purchase_receipt_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Échéance à 30 jours pour les fournisseurs
        reference: `FF-${Date.now().toString().slice(-6)}`,
        items: [
            { purchase_receipt_item_id: '', description: '', quantity: 0, unit_price: 0 }
        ],
    });

    const breadcrumbs = [
        { title: 'Achats', href: '#' },
        { title: 'Factures Fournisseurs', href: supplierInvoicesIndex.url() },
        { title: 'Nouvelle Facture', href: '#' },
    ];

    // --- LOGIQUE D'AUTO-REMPLISSAGE ---
    useEffect(() => {
        if (!data.purchase_receipt_id) return;

        const fetchReceiptDetails = async () => {
            setIsLoadingItems(true);
            try {
                // Appel API basé sur le web.php de Jules (préfixe purchases)
                const response = await axios.get(`/purchases/api/purchase-receipts/${data.purchase_receipt_id}`);
                const receipt = response.data;

                const newItems = receipt.items.map((item: any) => ({
                    purchase_receipt_item_id: item.id,
                    description: `${item.category.name} (BR: ${receipt.reference})`,
                    quantity: item.received_quantity, // On facture ce qui a été réellement reçu
                    unit_price: 0, // Le comptable saisit le prix de la facture papier
                }));

                setData(prev => ({
                    ...prev,
                    items: newItems,
                    // Si on peut déduire le fournisseur depuis la commande liée, on le fait
                    supplier_id: receipt.purchase_order?.supplier_id || prev.supplier_id 
                }));
            } catch (error) {
                console.error("Erreur lors de la récupération du BR", error);
            } finally {
                setIsLoadingItems(false);
            }
        };

        fetchReceiptDetails();
    }, [data.purchase_receipt_id]);

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
        post(supplierInvoicesStore.url());
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Saisie Facture Achat" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={supplierInvoicesIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-orange-500/5 flex items-center gap-3">
                        <FileText className="w-6 h-6 text-orange-600" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Saisie Facture Fournisseur</h2>
                            <p className="text-sm text-muted-foreground">Enregistrez la facture reçue du fournisseur pour préparer le paiement.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1.5 lg:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Bon de Réception Lié</label>
                            <select
                                value={data.purchase_receipt_id}
                                onChange={e => setData('purchase_receipt_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none font-bold focus:ring-2 focus:ring-orange-500/20"
                            >
                                <option value="">--- Sélectionner l'arrivage ---</option>
                                {receipts.map(r => <option key={r.id} value={r.id}>{r.reference}</option>)}
                            </select>
                            {errors.purchase_receipt_id && <p className="text-destructive text-[10px] font-bold">{errors.purchase_receipt_id}</p>}
                        </div>

                        <div className="space-y-1.5 lg:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Fournisseur</label>
                            <select
                                value={data.supplier_id}
                                onChange={e => setData('supplier_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                            >
                                <option value="">Sélectionner...</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.supplier_id && <p className="text-destructive text-[10px] font-bold">{errors.supplier_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Réf. Facture (Papier)</label>
                            <input type="text" value={data.reference} onChange={e => setData('reference', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-mono font-bold" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Date Facture</label>
                            <input type="date" value={data.invoice_date} onChange={e => setData('invoice_date', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none" />
                        </div>

                        <div className="space-y-1.5 lg:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Date Limite de Paiement</label>
                            <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none text-orange-600 font-bold" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden relative">
                    {isLoadingItems && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                                <span className="text-xs font-bold uppercase text-muted-foreground">Chargement des données...</span>
                            </div>
                        </div>
                    )}

                    <div className="p-4 border-b border-border bg-muted/30">
                        <h3 className="font-bold text-foreground text-sm uppercase tracking-widest">Détails de la Facture</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/20 text-[10px] uppercase font-black text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-6 py-3">Description Produit</th>
                                    <th className="px-4 py-3 text-center">Qté Facturée</th>
                                    <th className="px-4 py-3">Prix Unitaire Achat (FCFA)</th>
                                    <th className="px-4 py-3 text-right">Sous-total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.items.map((item, index) => (
                                    <tr key={index} className="group">
                                        <td className="px-6 py-3">
                                            <input type="text" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} className="w-full bg-transparent border-none text-sm font-semibold text-muted-foreground" />
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                                                className="w-full bg-muted/30 border border-border rounded px-2 py-1.5 text-sm font-black text-orange-600 text-right focus:bg-background"
                                                placeholder="Saisir prix..."
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right font-black">
                                            {(item.quantity * item.unit_price).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-muted/10 border-t border-border flex justify-end">
                        <div className="text-right flex items-center gap-4">
                            <Calculator className="w-8 h-8 text-orange-600 opacity-20" />
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Montant Dû</p>
                                <p className="text-3xl font-black text-foreground">
                                    {totalAmount.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">FCFA</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={processing || isLoadingItems} className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-3.5 rounded-xl font-black shadow-xl flex items-center gap-2 transition-all">
                        <Save className="w-5 h-5" />
                        {processing ? 'Enregistrement...' : 'Enregistrer la Facture Achat'}
                    </button>
                </div>
            </form>
        </div>
    );
}
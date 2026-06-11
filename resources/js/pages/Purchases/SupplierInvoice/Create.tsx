// pages/Purchases/SupplierInvoice/Create.tsx
import React, { useMemo } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, ArrowLeft, Receipt, ListPlus } from 'lucide-react';
import { supplierInvoicesIndex, supplierInvoicesStore } from '@/routes';

interface SelectionItem { id: number; name: string; reference?: string }

interface Props {
    suppliers: SelectionItem[]; // Chargé depuis le controlleur
    receipts: SelectionItem[];  // Bons de réceptions approuvés non encore facturés
}

interface InvoiceItem {
    purchase_receipt_item_id: string | number | null;
    description: string;
    quantity: number;
    unit_price: number;
}

export default function Create({ suppliers, receipts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        purchase_receipt_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        reference: '',
        items: [{ purchase_receipt_item_id: null, description: '', quantity: 1, unit_price: 0 }] as InvoiceItem[],
    });

    // Pilotage dynamique des lignes de facturation
    const addLine = () => {
        setData('items', [...data.items, { purchase_receipt_item_id: null, description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeLine = (index: number) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== index));
        }
    };

    const updateLine = (index: number, field: keyof InvoiceItem, value: any) => {
        const updatedItems = data.items.map((item, i) => {
            if (i === index) return { ...item, [field]: value };
            return item;
        });
        setData('items', updatedItems);
    };

    // Optimisation RAM : Calcul automatique du montant TTC de la facture en direct
    const invoiceTotal = useMemo(() => {
        return data.items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 0);
    }, [data.items]);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(supplierInvoicesStore.url());
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background text-foreground">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={supplierInvoicesIndex.url()} className="hover:text-foreground flex items-center gap-1">
                    <ArrowLeft size={14} /> Factures
                </Link>
                <span>/</span><span className="text-foreground font-medium">Nouvel enregistrement</span>
            </div>

            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Receipt className="text-secondary" /> Enregistrer une Facture Fournisseur
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Entête du document comptable */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Référence Facture</label>
                        <input 
                            type="text" 
                            value={data.reference} 
                            onChange={e => setData('reference', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5" 
                            placeholder="Ex: FAC-CENTRAL-9982" 
                        />
                        {errors.reference && <span className="text-destructive text-xs font-medium">{errors.reference}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Fournisseur</label>
                        <select 
                            value={data.supplier_id} 
                            onChange={e => setData('supplier_id', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5 text-sm"
                        >
                            <option value="">Sélectionner le tiers</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {errors.supplier_id && <span className="text-destructive text-xs font-medium">{errors.supplier_id}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Bon de Réception d'Origine</label>
                        <select 
                            value={data.purchase_receipt_id} 
                            onChange={e => setData('purchase_receipt_id', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5 text-sm"
                        >
                            <option value="">Sélectionner le BR approuvé</option>
                            {receipts.map(r => <option key={r.id} value={r.id}>{r.reference}</option>)}
                        </select>
                        {errors.purchase_receipt_id && <span className="text-destructive text-xs font-medium">{errors.purchase_receipt_id}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Date de Facturation</label>
                        <input 
                            type="date" 
                            value={data.invoice_date} 
                            onChange={e => setData('invoice_date', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5" 
                        />
                        {errors.invoice_date && <span className="text-destructive text-xs font-medium">{errors.invoice_date}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold">Date d'Échéance (Optionnel)</label>
                        <input 
                            type="date" 
                            value={data.due_date} 
                            onChange={e => setData('due_date', e.target.value)} 
                            className="w-full bg-input border border-border rounded-lg p-2.5" 
                        />
                        {errors.due_date && <span className="text-destructive text-xs font-medium">{errors.due_date}</span>}
                    </div>
                </div>

                {/* Tableau de ventilation financière */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <nav className=""><ListPlus size={16}/></nav> Détails financiers des lignes de facture
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
                                <th className="p-4">Libellé / Description de la ligne</th>
                                <th className="p-4 w-36 text-right">Quantité</th>
                                <th className="p-4 w-44 text-right">Prix Unitaire</th>
                                <th className="p-4 w-48 text-right">Montant HT</th>
                                <th className="p-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.items.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/10">
                                    <td className="p-3">
                                        <input 
                                            type="text" 
                                            value={item.description} 
                                            onChange={e => updateLine(index, 'description', e.target.value)} 
                                            placeholder="Ex: Facturation reliquat sac aliment maïs..." 
                                            className="w-full bg-input border border-border rounded-md p-2"
                                        />
                                        {errors[`items.${index}.description` as keyof typeof errors] && (
                                            <span className="text-destructive text-xs block mt-0.5">Invalide</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <input 
                                            type="number" 
                                            min="0.01" 
                                            step="0.01" 
                                            value={item.quantity || ''} 
                                            onChange={e => updateLine(index, 'quantity', Number(e.target.value))} 
                                            className="w-full bg-input border border-border rounded-md p-2 text-right font-medium" 
                                        />
                                        {errors[`items.${index}.quantity` as keyof typeof errors] && (
                                            <span className="text-destructive text-xs block mt-0.5">Invalide</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <input 
                                            type="number" 
                                            min="0" 
                                            value={item.unit_price || ''} 
                                            onChange={e => updateLine(index, 'unit_price', Number(e.target.value))} 
                                            className="w-full bg-input border border-border rounded-md p-2 text-right font-medium" 
                                        />
                                        {errors[`items.${index}.unit_price` as keyof typeof errors] && (
                                            <span className="text-destructive text-xs block mt-0.5">Invalide</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-right font-bold text-card-foreground">
                                        {(item.quantity * item.unit_price).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">FCFA</span>
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

                    {/* Bloc récapitulatif du Net à Payer */}
                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end">
                        <div className="text-right space-y-1">
                            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Net à Payer (CFAF)</span>
                            <p className="text-3xl font-black text-foreground">{invoiceTotal.toLocaleString()} <span className="text-lg font-bold text-muted-foreground">FCFA</span></p>
                        </div>
                    </div>
                </div>

                {/* Validation */}
                <div className="flex justify-end gap-4">
                    <Link href={supplierInvoicesIndex.url()} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Annuler
                    </Link>
                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        Valider et Enregistrer (Brouillon)
                    </button>
                </div>
            </form>
        </div>
    );
}
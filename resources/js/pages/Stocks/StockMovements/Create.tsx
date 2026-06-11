// pages/Stocks/StockMovements/Create.tsx
import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { stockMovementsIndex, stockMovementsStore } from '@/routes';

interface SelectionItem { id: number; name: string; symbol?: string }

interface Props {
    sites: SelectionItem[];
    categories: SelectionItem[];
    units: SelectionItem[];
}

export default function Create({ sites, categories, units }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        site_id: '',
        category_id: '',
        unit_id: '',
        type: 'out', // Valeur par défaut[cite: 34]
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const breadcrumbs = [
        { title: 'Logistique', href: '#' },
        { title: 'Mouvements', href: stockMovementsIndex.url() },
        { title: 'Nouveau Mouvement', href: '#' },
    ];

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(stockMovementsStore.url());
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Head title="Enregistrer un Mouvement" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={stockMovementsIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
                        <ArrowRightLeft className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-lg font-bold">Opération Manuelle de Stock</h2>
                            <p className="text-sm text-muted-foreground">Enregistrez une sortie exceptionnelle ou une régularisation.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type d'opération */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Type d'opération</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.type === 'out' ? 'border-destructive bg-destructive/5 text-destructive' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                                    <input type="radio" name="type" value="out" checked={data.type === 'out'} onChange={e => setData('type', e.target.value as any)} className="sr-only" />
                                    <span className="font-bold">Sortie (Casse, Perte, Expiration)</span>
                                </label>
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.type === 'adjustment' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-border text-muted-foreground hover:bg-muted'}`}>
                                    <input type="radio" name="type" value="adjustment" checked={data.type === 'adjustment'} onChange={e => setData('type', e.target.value as any)} className="sr-only" />
                                    <span className="font-bold">Ajustement (Inventaire)</span>
                                </label>
                            </div>
                            {errors.type && <p className="text-destructive text-[10px] font-bold mt-1">{errors.type}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Site concerné</label>
                            <select value={data.site_id} onChange={e => setData('site_id', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none">
                                <option value="">Sélectionner...</option>
                                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.site_id && <p className="text-destructive text-[10px] font-bold">{errors.site_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Date de l'opération</label>
                            <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                            {errors.date && <p className="text-destructive text-[10px] font-bold">{errors.date}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Produit / Article</label>
                            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none">
                                <option value="">Sélectionner...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.category_id && <p className="text-destructive text-[10px] font-bold">{errors.category_id}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Quantité</label>
                                <input type="number" min="0" step="0.01" value={data.quantity || ''} onChange={e => setData('quantity', Number(e.target.value))} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 font-bold outline-none" />
                                {errors.quantity && <p className="text-destructive text-[10px] font-bold">{errors.quantity}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Unité</label>
                                <select value={data.unit_id} onChange={e => setData('unit_id', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none">
                                    <option value="">Sélectionner...</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.symbol}</option>)}
                                </select>
                                {errors.unit_id && <p className="text-destructive text-[10px] font-bold">{errors.unit_id}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                                Notes / Motif de l'opération
                            </label>
                            <textarea value={data.notes || ''} onChange={e => setData('notes', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none min-h-[80px]" placeholder="Ex: Ajustement suite à l'inventaire du 30 Juin, 2 sacs percés par les rongeurs..." />
                            {errors.notes && <p className="text-destructive text-[10px] font-bold">{errors.notes}</p>}
                        </div>
                    </div>

                    <div className="p-6 bg-muted/20 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Attention : L'enregistrement d'un mouvement de stock modifie immédiatement et de façon irréversible les quantités disponibles.
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="submit" disabled={processing} className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold shadow-sm disabled:opacity-50 hover:bg-primary/90 transition-colors">
                        {processing ? 'Enregistrement...' : 'Valider l\'opération'}
                    </button>
                </div>
            </form>
        </div>
    );
}
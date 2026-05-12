import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Utensils, Info, Package, Scale } from 'lucide-react';
import { feedConsumptionsIndex, feedConsumptionsStore } from '@/routes';

interface Props {
    generations: { id: number; code: string; type: string }[];
    units: { id: number; name: string; symbol: string }[];
    categories: { id: number; name: string }[];
}

export default function CreateFeedConsumption({ generations, units, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        item_category_id: '', // L'aliment spécifique du stock
        unit_id: '',
        quantity: '',
    });

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Alimentation', href: feedConsumptionsIndex.url() },
        { title: 'Saisie Distribution', href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(feedConsumptionsStore.url());
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Saisie Aliment" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={feedConsumptionsIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-secondary/5 flex items-center gap-3">
                    <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                        <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Distribution d'Aliment</h2>
                        <p className="text-sm text-muted-foreground">Enregistrez la quantité servie au lot aujourd'hui.</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sélection du Lot */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Lot de destination</label>
                        <select
                            value={data.generation_id}
                            onChange={e => setData('generation_id', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        >
                            <option value="">Choisir un lot actif...</option>
                            {generations.map(gen => (
                                <option key={gen.id} value={gen.id}>{gen.code} ({gen.type})</option>
                            ))}
                        </select>
                        {errors.generation_id && <p className="text-destructive text-[10px] font-bold">{errors.generation_id}</p>}
                    </div>

                    {/* Date & Type d'Aliment */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Date de distribution</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                        />
                        {errors.date && <p className="text-destructive text-[10px] font-bold">{errors.date}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <Package className="w-3 h-3 text-accent" /> Article d'aliment
                        </label>
                        <select
                            value={data.item_category_id}
                            onChange={e => setData('item_category_id', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                        >
                            <option value="">Sélectionner l'aliment...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.item_category_id && <p className="text-destructive text-[10px] font-bold">{errors.item_category_id}</p>}
                    </div>

                    {/* Quantité & Unité */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Quantité servie</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 2"
                            value={data.quantity}
                            onChange={e => setData('quantity', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-bold text-foreground"
                        />
                        {errors.quantity && <p className="text-destructive text-[10px] font-bold">{errors.quantity}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <Scale className="w-3 h-3" /> Unité de mesure
                        </label>
                        <select
                            value={data.unit_id}
                            onChange={e => setData('unit_id', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                        >
                            <option value="">Choisir l'unité...</option>
                            {units.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                            ))}
                        </select>
                        {errors.unit_id && <p className="text-destructive text-[10px] font-bold">{errors.unit_id}</p>}
                    </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="w-4 h-4 text-primary" />
                        Le système convertira automatiquement la quantité en Kg lors de l'approbation. 
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-lg font-black transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Enregistrement...' : 'Valider la saisie'}
                    </button>
                </div>
            </form>
        </div>
    );
}
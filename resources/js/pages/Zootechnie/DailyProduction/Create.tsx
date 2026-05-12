import React, { useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Save, 
    ArrowLeft, 
    Egg, 
    AlertCircle, 
    Calculator,
    Package
} from 'lucide-react';
import { dailyProductionsIndex, dailyProductionsStore } from '@/routes';

interface Props {
    generations: { id: number; code: string; type: string }[];
    units: { id: number; name: string; symbol: string }[];
    categories: { id: number; name: string }[];
}

export default function CreateDailyProduction({ generations, units, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        unit_id: '',
        item_category_id: '', // "Œufs de table", "Œufs cassés", etc.
        good_quantity: 0,
        broken_quantity: 0,
    });

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Production d\'œufs', href: dailyProductionsIndex.url() },
        { title: 'Nouvelle Collecte', href: '#' },
    ];

    // Calculateur en temps réel pour le total affiché
    const totalCollected = useMemo(() => {
        return (Number(data.good_quantity) || 0) + (Number(data.broken_quantity) || 0);
    }, [data.good_quantity, data.broken_quantity]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(dailyProductionsStore.url());
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <Head title="Ferme-Landi | Saisie Collecte" />
            
            <div className="flex justify-between items-center">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={dailyProductionsIndex.url()}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
                    <div className="p-6 border-b border-border bg-primary/5">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
                            <Egg className="w-5 h-5" />
                            Enregistrement de la Ramasse
                        </h2>
                        <p className="text-sm text-muted-foreground">Saisissez les quantités collectées pour cette journée.</p>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sélection du Lot */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Génération (Lot)</label>
                            <select
                                value={data.generation_id}
                                onChange={e => setData('generation_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition"
                            >
                                <option value="">Choisir un lot actif...</option>
                                {generations.map(gen => (
                                    <option key={gen.id} value={gen.id}>
                                        {gen.code} ({gen.type})
                                    </option>
                                ))}
                            </select>
                            {errors.generation_id && <p className="text-destructive text-xs mt-1">{errors.generation_id}</p>}
                        </div>

                        {/* Date et Catégorie de Stock */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Date de collecte</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none transition"
                            />
                            {errors.date && <p className="text-destructive text-xs mt-1">{errors.date}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-1">
                                <Package className="w-3 h-3" /> Produit de stockage
                            </label>
                            <select
                                value={data.item_category_id}
                                onChange={e => setData('item_category_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 outline-none transition"
                            >
                                <option value="">Destination du stock...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.item_category_id && <p className="text-destructive text-xs mt-1">{errors.item_category_id}</p>}
                        </div>

                        {/* Quantités et Unités */}
                        <div className="p-4 bg-muted/30 rounded-lg md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border border-border/50">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Quantité Saine</label>
                                <input
                                    type="number"
                                    value={data.good_quantity}
                                    onChange={e => setData('good_quantity', Number(e.target.value))}
                                    className="w-full bg-background border border-border rounded-md px-3 py-2 font-bold text-primary"
                                />
                                {errors.good_quantity && <p className="text-destructive text-[10px] mt-1">{errors.good_quantity}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Quantité Cassée</label>
                                <input
                                    type="number"
                                    value={data.broken_quantity}
                                    onChange={e => setData('broken_quantity', Number(e.target.value))}
                                    className="w-full bg-background border border-border rounded-md px-3 py-2 font-bold text-destructive/70"
                                />
                                {errors.broken_quantity && <p className="text-destructive text-[10px] mt-1">{errors.broken_quantity}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Unité de saisie</label>
                                <select
                                    value={data.unit_id}
                                    onChange={e => setData('unit_id', e.target.value)}
                                    className="w-full bg-background border border-border rounded-md px-3 py-2"
                                >
                                    <option value="">Unité...</option>
                                    {units.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                                    ))}
                                </select>
                                {errors.unit_id && <p className="text-destructive text-[10px] mt-1">{errors.unit_id}</p>}
                            </div>
                        </div>

                        {/* Résumé visuel (Calculateur) */}
                        <div className="md:col-span-2 flex items-center justify-between p-4 bg-accent/5 border border-accent/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Calculator className="w-8 h-8 text-accent" />
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Total collecté (Brut)</p>
                                    <p className="text-xl font-black text-foreground">{totalCollected} <span className="text-sm font-medium text-muted-foreground">unités</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground italic">Note: Le stock sera mis à jour après approbation.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {processing ? 'Traitement...' : 'Soumettre pour Approbation'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
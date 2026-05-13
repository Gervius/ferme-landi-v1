import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Scale, Info, Users, Calculator } from 'lucide-react';
import { flockWeighingsIndex, flockWeighingsStore } from '@/routes';

interface Props {
    generations: { id: number; code: string; type: string }[];
}

export default function CreateFlockWeighing({ generations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        average_weight: '',
        weighed_subjects_count: '',
    });

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Pesée & Croissance', href: flockWeighingsIndex.url() },
        { title: 'Nouvelle Pesée', href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(flockWeighingsStore.url());
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Saisie Pesée" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={flockWeighingsIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-accent/5 flex items-center gap-3">
                    <div className="p-3 bg-accent/20 rounded-full text-accent-foreground">
                        <Scale className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Échantillonnage et Pesée</h2>
                        <p className="text-sm text-muted-foreground">Relevez le poids moyen pour suivre la courbe de croissance du lot (Porcs ou Chair).</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sélection du Lot (restreint par le backend aux porcs et poulets de chair) */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Lot concerné</label>
                        <select
                            value={data.generation_id}
                            onChange={e => setData('generation_id', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                        >
                            <option value="">Sélectionner un lot en engraissement...</option>
                            {generations.map(gen => (
                                <option key={gen.id} value={gen.id}>{gen.code} ({gen.type.toUpperCase()})</option>
                            ))}
                        </select>
                        {errors.generation_id && <p className="text-destructive text-[10px] font-bold">{errors.generation_id}</p>}
                        {generations.length === 0 && (
                            <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                                <Info className="w-3 h-3" /> Aucun lot de type "Chair" ou "Porc" n'est actuellement actif.
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Date de la pesée</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                        />
                        {errors.date && <p className="text-destructive text-[10px] font-bold">{errors.date}</p>}
                    </div>

                    {/* Le bloc de saisie avec calculateur mental d'UI */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-muted/30 rounded-xl border border-border/50">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" /> Taille de l'échantillon
                            </label>
                            <input
                                type="number"
                                placeholder="Ex: 50"
                                value={data.weighed_subjects_count}
                                onChange={e => setData('weighed_subjects_count', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-medium outline-none"
                            />
                            <p className="text-[10px] text-muted-foreground">Nombre d'animaux aléatoires pesés.</p>
                            {errors.weighed_subjects_count && <p className="text-destructive text-[10px] font-bold">{errors.weighed_subjects_count}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                <Calculator className="w-3.5 h-3.5 text-accent" /> Poids Moyen (Kg)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 1.25"
                                    value={data.average_weight}
                                    onChange={e => setData('average_weight', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg pl-3 pr-12 py-2.5 outline-none font-black text-lg text-foreground focus:ring-2 focus:ring-accent/30 focus:border-accent"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Kg</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Poids moyen déduit de l'échantillon.</p>
                            {errors.average_weight && <p className="text-destructive text-[10px] font-bold">{errors.average_weight}</p>}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="w-4 h-4 text-primary" />
                        Cette donnée mettra à jour les métriques quotidiennes (DailyFlockMetric).
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-xl font-black transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Enregistrement...' : 'Valider la pesée'}
                    </button>
                </div>
            </form>
        </div>
    );
}
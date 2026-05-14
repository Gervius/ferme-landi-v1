import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Target, Activity, Egg, Utensils, Info } from 'lucide-react';
import { breedStandardsIndex, breedStandardsStore } from '@/routes';

interface Props {
    breeds: { id: number; name: string }[];
}

export default function CreateBreedStandard({ breeds }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        breed_id: '',
        age_weeks: '',
        target_weight_kg: '',
        target_laying_rate: '',
        target_fcr: '',
    });

    const breadcrumbs = [
        { title: 'Configuration ERP', href: '#' },
        { title: 'Standards', href: breedStandardsIndex.url() },
        { title: 'Nouveau Standard', href: '#' },
    ];

    // Utilisation du type React.SubmitEvent comme demandé
    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(breedStandardsStore.url());
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Saisie Standard" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={breedStandardsIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-primary/5 flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Objectifs de la Souche</h2>
                        <p className="text-sm text-muted-foreground">Fixez les performances théoriques attendues pour une race à un âge donné.</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Identification de la cible */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Race / Souche concernée</label>
                        <select
                            value={data.breed_id}
                            onChange={e => setData('breed_id', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition font-bold"
                        >
                            <option value="">--- Sélectionner la race ---</option>
                            {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                        {errors.breed_id && <p className="text-destructive text-[10px] font-bold">{errors.breed_id}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Âge d'évaluation (Semaines)</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Ex: 24"
                            value={data.age_weeks}
                            onChange={e => setData('age_weeks', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none font-bold"
                        />
                        {errors.age_weeks && <p className="text-destructive text-[10px] font-bold">{errors.age_weeks}</p>}
                    </div>

                    <div className="hidden md:block"></div> {/* Spacer */}

                    {/* KPIs Cibles */}
                    <div className="bg-muted/10 p-5 rounded-xl border border-border/50 space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-secondary" /> Poids vif cible (Kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 1.85"
                            value={data.target_weight_kg}
                            onChange={e => setData('target_weight_kg', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-secondary/20"
                        />
                        {errors.target_weight_kg && <p className="text-destructive text-[10px] font-bold">{errors.target_weight_kg}</p>}
                        <p className="text-[10px] text-muted-foreground mt-1">Recommandé pour Poulet de chair & Porcs.</p>
                    </div>

                    <div className="bg-muted/10 p-5 rounded-xl border border-border/50 space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                            <Egg className="w-3.5 h-3.5 text-primary" /> Taux de ponte cible (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            max="100"
                            placeholder="Ex: 92.5"
                            value={data.target_laying_rate}
                            onChange={e => setData('target_laying_rate', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {errors.target_laying_rate && <p className="text-destructive text-[10px] font-bold">{errors.target_laying_rate}</p>}
                        <p className="text-[10px] text-muted-foreground mt-1">Recommandé pour Pondeuses.</p>
                    </div>

                    <div className="bg-muted/10 p-5 rounded-xl border border-border/50 space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-accent" /> Indice de Consommation (IC) cible
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 2.1"
                            value={data.target_fcr}
                            onChange={e => setData('target_fcr', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/20"
                        />
                        {errors.target_fcr && <p className="text-destructive text-[10px] font-bold">{errors.target_fcr}</p>}
                        <p className="text-[10px] text-muted-foreground mt-1">Ratio entre l'aliment consommé et le gain de poids/masse d'œufs.</p>
                    </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="w-4 h-4 text-primary shrink-0" />
                        Ces données permettront au Tableau de Bord de tracer les courbes d'écart entre théorie et réalité.
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-xl font-black transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Enregistrement...' : 'Valider les objectifs'}
                    </button>
                </div>
            </form>
        </div>
    );
}
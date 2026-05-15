import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Stethoscope, Info, Activity, Pill, UserPlus } from 'lucide-react';
import { healthTreatmentsIndex, healthTreatmentsStore } from '@/routes';

interface Props {
    generations: { id: number; code: string; type: string }[];
}

export default function CreateHealthTreatment({ generations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        disease_description: '',
        medication_name: '',
        dosage_description: '',
        veterinarian_name: '',
    });

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Santé & Soins', href: healthTreatmentsIndex.url() },
        { title: 'Nouveau Traitement', href: '#' },
    ];

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(healthTreatmentsStore.url());
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Saisie Traitement" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={healthTreatmentsIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-primary/5 flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Déclaration de Soins / Traitement</h2>
                        <p className="text-sm text-muted-foreground">Enregistrez une intervention médicale précise sur un lot.</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Lot concerné */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Lot (Génération) traité</label>
                        <select
                            value={data.generation_id}
                            onChange={e => setData('generation_id', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                        >
                            <option value="">--- Sélectionner le lot ---</option>
                            {generations.map(gen => (
                                <option key={gen.id} value={gen.id}>{gen.code} ({gen.type})</option>
                            ))}
                        </select>
                        {errors.generation_id && <p className="text-destructive text-[10px] font-bold">{errors.generation_id}</p>}
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Date d'intervention</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                        />
                        {errors.date && <p className="text-destructive text-[10px] font-bold">{errors.date}</p>}
                    </div>

                    {/* Vétérinaire (Optionnel) */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter flex items-center gap-1.5">
                            <UserPlus className="w-3.5 h-3.5" /> Vétérinaire / Intervenant
                        </label>
                        <input
                            type="text"
                            placeholder="Nom du vétérinaire (Optionnel)"
                            value={data.veterinarian_name}
                            onChange={e => setData('veterinarian_name', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {errors.veterinarian_name && <p className="text-destructive text-[10px] font-bold">{errors.veterinarian_name}</p>}
                    </div>

                    {/* Maladie / Raison */}
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-orange-500" /> Maladie / Raison du traitement
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Ex: Apparition de coryza, prévention, faiblesse générale..."
                            value={data.disease_description}
                            onChange={e => setData('disease_description', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 resize-none font-medium"
                        />
                        {errors.disease_description && <p className="text-destructive text-[10px] font-bold">{errors.disease_description}</p>}
                    </div>

                    {/* Médicament et Dosage */}
                    <div className="bg-muted/30 p-5 rounded-xl border border-border/50 space-y-4 md:col-span-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter flex items-center gap-1.5">
                                <Pill className="w-3.5 h-3.5 text-secondary" /> Nom du Produit / Médicament
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: Amoxicilline 50% ou Vitamine AD3E"
                                value={data.medication_name}
                                onChange={e => setData('medication_name', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-secondary/20 font-bold"
                            />
                            {errors.medication_name && <p className="text-destructive text-[10px] font-bold">{errors.medication_name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Posologie / Dosage</label>
                            <input
                                type="text"
                                placeholder="Ex: 1g pour 10 Litres d'eau pendant 3 jours"
                                value={data.dosage_description}
                                onChange={e => setData('dosage_description', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-secondary/20"
                            />
                            {errors.dosage_description && <p className="text-destructive text-[10px] font-bold">{errors.dosage_description}</p>}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                        <Info className="w-4 h-4 text-primary shrink-0" />
                        Ce traitement restera en "brouillon" jusqu'à sa validation par le responsable d'élevage.
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-xl font-black transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Enregistrement...' : 'Soumettre le traitement'}
                    </button>
                </div>
            </form>
        </div>
    );
}
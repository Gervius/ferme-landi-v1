import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Skull, AlertCircle, Info } from 'lucide-react';
import { flockMortalitiesIndex, flockMortalitiesStore } from '@/routes';

interface Generation {
    id: number;
    code: string;
    type: string;
    current_quantity: number;
}

interface Props {
    generations: Generation[];
}

export default function CreateMortality({ generations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        quantity: '',
        cause: '',
        estimated_financial_loss: '',
    });

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Mortalité', href: flockMortalitiesIndex.url() },
        { title: 'Déclaration', href: '#' },
    ];

    // Trouver la génération sélectionnée pour afficher l'effectif actuel
    const selectedGen = generations.find(g => g.id === Number(data.generation_id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(flockMortalitiesStore.url());
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Déclarer Perte" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={flockMortalitiesIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-destructive/5 flex items-center gap-3">
                    <div className="p-3 bg-destructive/10 rounded-full text-destructive">
                        <Skull className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Déclaration de Mortalité</h2>
                        <p className="text-sm text-muted-foreground italic">Cet enregistrement sera soumis en brouillon avant validation.</p>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Lot & Effectif */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Génération (Lot)</label>
                            <select
                                value={data.generation_id}
                                onChange={e => setData('generation_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive transition"
                            >
                                <option value="">Sélectionner le lot concerné...</option>
                                {generations.map(gen => (
                                    <option key={gen.id} value={gen.id}>{gen.code} ({gen.type})</option>
                                ))}
                            </select>
                            {errors.generation_id && <p className="text-destructive text-[10px] font-bold">{errors.generation_id}</p>}
                        </div>

                        <div className="bg-muted/50 p-3 rounded-lg border border-border/50 flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Effectif actuel</span>
                            <span className="text-xl font-black text-foreground">
                                {selectedGen ? selectedGen.current_quantity.toLocaleString() : '--'} <span className="text-xs font-normal opacity-70">sujets</span>
                            </span>
                        </div>
                    </div>

                    {/* Date & Quantité */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Date du constat</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                            />
                            {errors.date && <p className="text-destructive text-[10px] font-bold">{errors.date}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Nombre de morts</label>
                            <input
                                type="number"
                                placeholder="Ex: 5"
                                value={data.quantity}
                                onChange={e => setData('quantity', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-bold text-destructive"
                            />
                            {errors.quantity && <p className="text-destructive text-[10px] font-bold">{errors.quantity}</p>}
                        </div>
                    </div>

                    {/* Cause & Perte financière */}
                    <div className="space-y-4 pt-2">
                        <div className="space-y-1.5 text-sm">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Cause probable</label>
                            <textarea
                                rows={2}
                                placeholder="Détaillez la cause suspectée (Maladie, Accident, etc.)"
                                value={data.cause}
                                onChange={e => setData('cause', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Perte financière estimée (Optionnel)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Ex: 15000"
                                    value={data.estimated_financial_loss}
                                    onChange={e => setData('estimated_financial_loss', e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg pl-3 pr-12 py-2.5 outline-none font-medium text-foreground"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">FCFA</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Info className="w-4 h-4 text-primary" />
                        L'approbation soustraira automatiquement la quantité du cheptel vivant.
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8 py-3 rounded-lg font-black transition-all shadow-lg shadow-destructive/20 flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Traitement...' : 'Déclarer la perte'}
                    </button>
                </div>
            </form>
        </div>
    );
}
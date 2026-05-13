import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, LogOut, Info, Scale, Tags } from 'lucide-react';
import { flockCullingsIndex, flockCullingsStore } from '@/routes';

interface Generation {
    id: number;
    code: string;
    type: string;
    current_quantity: number;
}

interface Props {
    generations: Generation[];
}

export default function CreateFlockCulling({ generations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        quantity: '', // Nom du champ dans la requête StoreFlockCullingRequest (bien que le modèle attende quantity_culled, on mappe sur la Request)
        reason: '',
        weight_kg: '',
    });

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Réformes', href: flockCullingsIndex.url() },
        { title: 'Nouvelle Sortie', href: '#' },
    ];

    const selectedGen = generations.find(g => g.id === Number(data.generation_id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(flockCullingsStore.url());
    };

    // Suggestions de motifs pour faciliter la saisie
    const commonReasons = [
        "Âge limite atteint (Fin de cycle)",
        "Baisse de ponte drastique",
        "Tri sanitaire (Sujets chétifs)",
        "Vente anticipée (Chair)",
        "Surpopulation"
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Saisie Réforme" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={flockCullingsIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-secondary/10 flex items-center gap-3">
                    <div className="p-3 bg-secondary/20 rounded-full text-secondary-foreground">
                        <LogOut className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Déclaration de Réforme</h2>
                        <p className="text-sm text-muted-foreground">Retrait planifié de sujets du cheptel pour vente ou abattage.</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sélection du Lot et Effectif */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Lot concerné</label>
                            <select
                                value={data.generation_id}
                                onChange={e => setData('generation_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-secondary/40 transition"
                            >
                                <option value="">Sélectionner le lot...</option>
                                {generations.map(gen => (
                                    <option key={gen.id} value={gen.id}>{gen.code} ({gen.type})</option>
                                ))}
                            </select>
                            {errors.generation_id && <p className="text-destructive text-[10px] font-bold">{errors.generation_id}</p>}
                        </div>

                        <div className="bg-muted/50 p-3 rounded-lg border border-border/50 flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Effectif vivant actuel</span>
                            <span className="text-xl font-black text-foreground">
                                {selectedGen ? selectedGen.current_quantity.toLocaleString() : '--'} <span className="text-xs font-normal opacity-70">sujets</span>
                            </span>
                        </div>
                    </div>

                    {/* Date et Quantité */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Date de retrait</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                        />
                        {errors.date && <p className="text-destructive text-[10px] font-bold">{errors.date}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Nombre de sujets retirés</label>
                        <input
                            type="number"
                            placeholder="Ex: 150"
                            value={data.quantity}
                            onChange={e => setData('quantity', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-black text-lg text-foreground focus:ring-2 focus:ring-secondary/40 outline-none"
                        />
                        {errors.quantity && <p className="text-destructive text-[10px] font-bold">{errors.quantity}</p>}
                    </div>

                    {/* Motif et Poids */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <Tags className="w-3 h-3 text-secondary" /> Motif de la réforme
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Fin de cycle de ponte..."
                            value={data.reason}
                            onChange={e => setData('reason', e.target.value)}
                            list="reason-suggestions"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none"
                        />
                        <datalist id="reason-suggestions">
                            {commonReasons.map((r, idx) => <option key={idx} value={r} />)}
                        </datalist>
                        {errors.reason && <p className="text-destructive text-[10px] font-bold">{errors.reason}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <Scale className="w-3 h-3 text-accent" /> Poids total estimé / réel (Optionnel)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Ex: 300.50"
                                value={data.weight_kg}
                                onChange={e => setData('weight_kg', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg pl-3 pr-12 py-2.5 outline-none font-medium"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">Kg</span>
                        </div>
                        {errors.weight_kg && <p className="text-destructive text-[10px] font-bold">{errors.weight_kg}</p>}
                    </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="w-4 h-4 text-primary" />
                        La validation réduira l'effectif vivant. Cette action pourra être liée au module de Vente.
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-3 rounded-xl font-black transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Enregistrement...' : 'Valider la sortie'}
                    </button>
                </div>
            </form>
        </div>
    );
}
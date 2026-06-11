// pages/Generations/Edit.tsx
import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { generationsIndex, generationsUpdate } from '@/routes';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';

interface Props {
    generation: {
        id: number;
        site_id: number;
        breed_id: number;
        type: string;
        start_date: string;
        initial_quantity: number;
        current_quantity: number;
        status: string;
        observation: string;
    };
    sites: { id: number; name: string }[];
    breeds: { id: number; name: string }[];
}

export default function Edit({ generation, sites, breeds }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        site_id: generation.site_id,
        breed_id: generation.breed_id,
        type: generation.type,
        start_date: generation.start_date.split('T')[0],
        initial_quantity: generation.initial_quantity,
        current_quantity: generation.current_quantity,
        status: generation.status,
        observation: generation.observation || '',
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        put(generationsUpdate.url(generation.id));
    };

    const strategy = getGenerationDisplay(data.type);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted ${strategy.colorClass}`}>
                    <strategy.Icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Mise à jour du Lot</h1>
                    <p className="text-muted-foreground text-sm">Modifiez les effectifs ou clôturez cette génération.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Colonne 1 : Identification */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Identification</h2>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground">Site d'élevage</label>
                            <select value={data.site_id} onChange={e => setData('site_id', Number(e.target.value))} className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring">
                                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.site_id && <span className="text-destructive text-xs">{errors.site_id}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-card-foreground">Espèce / Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring">
                                    <option value="pondeuse">Pondeuse</option>
                                    <option value="chair">Chair</option>
                                    <option value="porc">Porcin</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-card-foreground">Race</label>
                                <select value={data.breed_id} onChange={e => setData('breed_id', Number(e.target.value))} className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring">
                                    {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground">Date de démarrage</label>
                            <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring"/>
                        </div>
                    </div>

                    {/* Colonne 2 : Effectifs & Statut */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">Effectifs & État</h2>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground">Statut du lot</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring font-medium">
                                <option value="actif">Actif (En production)</option>
                                <option value="cloture">Clôturé (Vendu/Terminé)</option>
                                <option value="reforme">Réformé</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-card-foreground">Quantité Initiale</label>
                                <input type="number" min="1" value={data.initial_quantity} onChange={e => setData('initial_quantity', Number(e.target.value))} className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-primary">Quantité Actuelle</label>
                                <input type="number" min="0" value={data.current_quantity} onChange={e => setData('current_quantity', Number(e.target.value))} className="w-full bg-input border border-primary/50 text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring bg-primary/5"/>
                                {errors.current_quantity && <span className="text-destructive text-xs">{errors.current_quantity}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground">Observations</label>
                            <textarea value={data.observation} onChange={e => setData('observation', e.target.value)} className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring min-h-[100px] resize-none" placeholder="Notes sur la santé, incidents..."/>
                        </div>
                    </div>
                </div>

                <div className="bg-muted p-6 border-t border-border flex justify-end gap-4">
                    <Link href={generationsIndex.url()} className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Annuler
                    </Link>
                    <button type="submit" disabled={processing} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm">
                        Mettre à jour le lot
                    </button>
                </div>
            </form>
        </div>
    );
}
// pages/Generations/Create.tsx
import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Layers } from 'lucide-react';
import { generationsIndex, generationsStore } from '@/routes';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';

interface Props {
    sites: { id: number; name: string }[];
    breeds: { id: number; name: string }[];
}

export default function Create({ sites, breeds }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        site_id: '',
        breed_id: '',
        type: 'pondeuse', // Valeur par défaut
        start_date: new Date().toISOString().split('T')[0],
        initial_quantity: 0,
        observation: '',
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(generationsStore.url());
    };

    // Le pattern stratégie met à jour l'UI dynamiquement selon le type sélectionné !
    const strategy = getGenerationDisplay(data.type);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header Dynamique */}
            <div className="flex items-center gap-4 transition-all duration-300">
                <div className={`p-3 rounded-xl bg-muted transition-colors duration-300 ${strategy.colorClass}`}>
                    <strategy.Icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Déclarer un nouveau Lot</h1>
                    <p className="text-muted-foreground text-sm">
                        Initialisez une nouvelle génération directement associée à un site.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Colonne 1 : Identification du Lot */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                            <Layers size={16} className="text-muted-foreground" />
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Identification</h2>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground">Site d'élevage</label>
                            <select 
                                value={data.site_id} 
                                onChange={e => setData('site_id', e.target.value)} 
                                className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring transition-shadow"
                            >
                                <option value="">Sélectionnez un site d'affectation</option>
                                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.site_id && <span className="text-destructive text-xs font-medium">{errors.site_id}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-card-foreground">Espèce / Type</label>
                                <select 
                                    value={data.type} 
                                    onChange={e => setData('type', e.target.value)} 
                                    className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring transition-shadow"
                                >
                                    <option value="pondeuse">Pondeuse</option>
                                    <option value="chair">Poulet de chair</option>
                                    <option value="porc">Porcin</option>
                                </select>
                                {errors.type && <span className="text-destructive text-xs font-medium">{errors.type}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-card-foreground">Race / Souche</label>
                                <select 
                                    value={data.breed_id} 
                                    onChange={e => setData('breed_id', e.target.value)} 
                                    className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring transition-shadow"
                                >
                                    <option value="">Sélectionnez</option>
                                    {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                {errors.breed_id && <span className="text-destructive text-xs font-medium">{errors.breed_id}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground">Date de démarrage</label>
                            <input 
                                type="date" 
                                value={data.start_date} 
                                onChange={e => setData('start_date', e.target.value)} 
                                className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring transition-shadow"
                            />
                            {errors.start_date && <span className="text-destructive text-xs font-medium">{errors.start_date}</span>}
                        </div>
                    </div>

                    {/* Colonne 2 : Effectifs & Configuration */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                            <strategy.Icon size={16} className={strategy.colorClass} />
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Configuration Initiale</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground">Quantité Initiale (Nombre de têtes)</label>
                            <input 
                                type="number" 
                                min="1" 
                                placeholder="Ex: 5000"
                                value={data.initial_quantity || ''} 
                                onChange={e => setData('initial_quantity', Number(e.target.value))} 
                                className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring text-lg font-bold transition-shadow"
                            />
                            {errors.initial_quantity && <span className="text-destructive text-xs font-medium">{errors.initial_quantity}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-card-foreground flex justify-between">
                                Observations (Optionnel)
                                <span className="text-xs text-muted-foreground font-normal">État de santé à la réception, fournisseur...</span>
                            </label>
                            <textarea 
                                value={data.observation} 
                                onChange={e => setData('observation', e.target.value)} 
                                className="w-full bg-input border border-border text-foreground rounded-lg p-2.5 focus:ring-ring focus:border-ring min-h-[140px] resize-none transition-shadow"
                                placeholder="Détails supplémentaires concernant ce lot..."
                            />
                            {errors.observation && <span className="text-destructive text-xs font-medium">{errors.observation}</span>}
                        </div>
                    </div>
                </div>

                {/* Footer du formulaire */}
                <div className="bg-muted p-6 border-t border-border flex justify-end gap-4">
                    <Link 
                        href={generationsIndex.url()} 
                        className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Annuler
                    </Link>
                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
                    >
                        <strategy.Icon size={18} />
                        Enregistrer la Génération
                    </button>
                </div>
            </form>
        </div>
    );
}
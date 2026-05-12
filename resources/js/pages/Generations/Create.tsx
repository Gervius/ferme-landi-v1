import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Info, AlertCircle } from 'lucide-react';
import { generationsIndex, generationsStore } from '@/routes';

interface Props {
    sites: { id: number; name: string }[];
    breeds: { id: number; name: string }[];
}

export default function CreateGeneration({ sites, breeds }: Props) {
    // Utilisation du hook useForm d'Inertia pour gérer l'état et les erreurs
    const { data, setData, post, processing, errors } = useForm({
        site_id: '',
        breed_id: '',
        type: 'pondeuse',
        start_date: new Date().toISOString().split('T')[0],
        initial_quantity: '',
        observation: '',
    });

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Générations', href: generationsIndex.url() },
        { title: 'Nouveau Lot', href: '#' },
    ];

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(generationsStore.url());
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <Head title="Ferme-Landi | Nouveau Lot" />
            
            <div className="flex justify-between items-center">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={generationsIndex.url()}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la liste
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
                    <div className="p-6 border-b border-border bg-muted/30">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <Info className="w-5 h-5 text-primary" />
                            Informations du Lot
                        </h2>
                        <p className="text-sm text-muted-foreground">Définissez l'origine et les caractéristiques de la nouvelle génération.</p>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type d'animal */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Type de production</label>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            >
                                <option value="pondeuse">Pondeuses (Œufs)</option>
                                <option value="chair">Poulets de Chair (Viande)</option>
                                <option value="porc">Porcins</option>
                            </select>
                            {errors.type && <p className="text-destructive text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.type}</p>}
                        </div>

                        {/* Date de démarrage */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Date d'arrivée / Naissance</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            />
                            {errors.start_date && <p className="text-destructive text-xs mt-1">{errors.start_date}</p>}
                        </div>

                        {/* Site (Localisation) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Site d'affectation</label>
                            <select
                                value={data.site_id}
                                onChange={e => setData('site_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            >
                                <option value="">Sélectionner un site...</option>
                                {sites.map(site => (
                                    <option key={site.id} value={site.id}>{site.name}</option>
                                ))}
                            </select>
                            {errors.site_id && <p className="text-destructive text-xs mt-1">{errors.site_id}</p>}
                        </div>

                        {/* Race (Breed) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Race / Souche</label>
                            <select
                                value={data.breed_id}
                                onChange={e => setData('breed_id', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            >
                                <option value="">Sélectionner une race...</option>
                                {breeds.map(breed => (
                                    <option key={breed.id} value={breed.id}>{breed.name}</option>
                                ))}
                            </select>
                            {errors.breed_id && <p className="text-destructive text-xs mt-1">{errors.breed_id}</p>}
                        </div>

                        {/* Quantité Initiale */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Effectif initial (Sujets)</label>
                            <input
                                type="number"
                                placeholder="Ex: 500"
                                value={data.initial_quantity}
                                onChange={e => setData('initial_quantity', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            />
                            {errors.initial_quantity && <p className="text-destructive text-xs mt-1">{errors.initial_quantity}</p>}
                        </div>

                        {/* Observations */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold">Observations / Notes</label>
                            <textarea
                                rows={3}
                                placeholder="Détails sur la provenance, l'état sanitaire à l'arrivée..."
                                value={data.observation}
                                onChange={e => setData('observation', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
                            />
                            {errors.observation && <p className="text-destructive text-xs mt-1">{errors.observation}</p>}
                        </div>
                    </div>

                    <div className="p-6 bg-muted/20 border-t border-border flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {processing ? 'Enregistrement...' : 'Enregistrer le Lot'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
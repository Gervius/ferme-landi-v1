import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, ShieldPlus, Plus, Trash2, Clock, AlertCircle, Pill } from 'lucide-react';
import { prophylaxisProgramsIndex, prophylaxisProgramsStore } from '@/routes';

interface Category {
    id: number;
    name: string;
}

interface Props {
    medicationCategories: Category[];
}

export default function CreateProphylaxisProgram({ medicationCategories }: Props) {
    // Initialisation du formulaire avec un tableau d'étapes (steps)
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        animal_type: 'pondeuse',
        is_active: true,
        steps: [
            // Une première étape vide par défaut
            { day_offset: '', medication_category_id: '', description: '', alert_days_before: '2' }
        ],
    });

    const breadcrumbs = [
        { title: 'Administration', href: '#' },
        { title: 'Prog. Prophylactiques', href: prophylaxisProgramsIndex.url() },
        { title: 'Nouveau Programme', href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(prophylaxisProgramsStore.url());
    };

    // Gestionnaires dynamiques pour les étapes
    const addStep = () => {
        setData('steps', [
            ...data.steps, 
            { day_offset: '', medication_category_id: '', description: '', alert_days_before: '2' }
        ]);
    };

    const removeStep = (indexToRemove: number) => {
        setData('steps', data.steps.filter((_, index) => index !== indexToRemove));
    };

    const updateStep = (index: number, field: string, value: string | number) => {
        const newSteps = [...data.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setData('steps', newSteps);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Créer Programme" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={prophylaxisProgramsIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* BLOC 1 : Informations générales */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border bg-muted/20 flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                            <ShieldPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-foreground">Paramètres du Programme</h2>
                            <p className="text-xs text-muted-foreground">Définissez le nom et la cible de ce calendrier de soins.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Nom du programme</label>
                            <input
                                type="text"
                                placeholder="Ex: Programme Pondeuse Standard 2026"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {errors.name && <p className="text-destructive text-[10px] font-bold">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Espèce Cible</label>
                            <select
                                value={data.animal_type}
                                onChange={e => setData('animal_type', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="pondeuse">Pondeuse (Œufs)</option>
                                <option value="chair">Poulet de Chair (Viande)</option>
                                <option value="porc">Porcin</option>
                            </select>
                            {errors.animal_type && <p className="text-destructive text-[10px] font-bold">{errors.animal_type}</p>}
                        </div>
                    </div>
                </div>

                {/* BLOC 2 : Constructeur d'étapes dynamique */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border bg-accent/5 flex justify-between items-center">
                        <div>
                            <h2 className="font-bold text-foreground">Chronologie des Interventions</h2>
                            <p className="text-xs text-muted-foreground">Ajoutez les vaccins et soins en fonction de l'âge du lot (en jours).</p>
                        </div>
                        <button
                            type="button"
                            onClick={addStep}
                            className="bg-accent/20 hover:bg-accent/30 text-accent-foreground px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                        >
                            <Plus className="w-4 h-4" /> Ajouter une étape
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {data.steps.map((step, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-muted/20 border border-border rounded-xl relative group transition-all hover:border-primary/30">
                                
                                {/* Jour d'application */}
                                <div className="w-full md:w-32 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-primary" /> Application
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">J +</span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="7"
                                            value={step.day_offset}
                                            onChange={e => updateStep(index, 'day_offset', e.target.value)}
                                            className="w-full bg-background border border-border rounded-md pl-10 pr-3 py-2 font-black outline-none focus:border-primary"
                                        />
                                    </div>
                                    {errors[`steps.${index}.day_offset`] && <p className="text-destructive text-[10px]">{errors[`steps.${index}.day_offset`]}</p>}
                                </div>

                                {/* Type de Médicament */}
                                <div className="w-full md:flex-1 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                                        <Pill className="w-3 h-3 text-secondary" /> Type de produit
                                    </label>
                                    <select
                                        value={step.medication_category_id}
                                        onChange={e => updateStep(index, 'medication_category_id', e.target.value)}
                                        className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary text-sm"
                                    >
                                        <option value="">Sélectionner une catégorie...</option>
                                        {medicationCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors[`steps.${index}.medication_category_id`] && <p className="text-destructive text-[10px]">{errors[`steps.${index}.medication_category_id`]}</p>}
                                </div>

                                {/* Description */}
                                <div className="w-full md:flex-1 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Description du soin</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Vaccin Newcastle souche HB1"
                                        value={step.description}
                                        onChange={e => updateStep(index, 'description', e.target.value)}
                                        className="w-full bg-background border border-border rounded-md px-3 py-2 outline-none focus:border-primary text-sm"
                                    />
                                    {errors[`steps.${index}.description`] && <p className="text-destructive text-[10px]">{errors[`steps.${index}.description`]}</p>}
                                </div>

                                {/* Alerte Avant */}
                                <div className="w-full md:w-36 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 text-orange-500" /> Alerte Avant
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            value={step.alert_days_before}
                                            onChange={e => updateStep(index, 'alert_days_before', e.target.value)}
                                            className="w-full bg-background border border-border rounded-md px-3 pr-10 py-2 outline-none text-sm"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Jours</span>
                                    </div>
                                    {errors[`steps.${index}.alert_days_before`] && <p className="text-destructive text-[10px]">{errors[`steps.${index}.alert_days_before`]}</p>}
                                </div>

                                {/* Bouton Supprimer */}
                                {data.steps.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        className="absolute -right-3 -top-3 bg-destructive text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-destructive/90"
                                        title="Retirer cette étape"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bouton de Soumission */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing || data.steps.length === 0}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-xl font-black transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Enregistrement...' : 'Sauvegarder le Programme'}
                    </button>
                </div>
            </form>
        </div>
    );
}
// pages/Zootechnie/ProphylaxisProgram/Create.tsx
import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, ShieldPlus, ArrowLeft, Layers } from 'lucide-react';
import { prophylaxisProgramsIndex, prophylaxisProgramsStore } from '@/routes';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';

interface MedicationCategory {
    id: number;
    name: string;
}

interface Props {
    medicationCategories: { id: number; name: string }[];
}

interface FormStep {
    day_offset: number;
    medication_category_id: string | number;
    description: string;
    alert_days_before: number;
}

export default function Create({ medicationCategories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        animal_type: 'pondeuse',
        is_active: true,
        steps: [] as FormStep[],
    });

    // Ajouter une nouvelle étape vide au protocole
    const addStep = () => {
        const newStep: FormStep = {
            day_offset: 0,
            medication_category_id: '',
            description: '',
            alert_days_before: 0,
        };
        setData('steps', [...data.steps, newStep]);
    };

    // Retirer une étape du protocole
    const removeStep = (index: number) => {
        const updatedSteps = data.steps.filter((_, i) => i !== index);
        setData('steps', updatedSteps);
    };

    // Mettre à jour un champ spécifique d'une étape
    const updateStep = (index: number, field: keyof FormStep, value: any) => {
        const updatedSteps = data.steps.map((step, i) => {
            if (i === index) {
                return { ...step, [field]: value };
            }
            return step;
        });
        setData('steps', updatedSteps);
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(prophylaxisProgramsStore.url());
    };

    const strategy = getGenerationDisplay(data.animal_type);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 bg-background text-foreground">
            {/* Fil d'Ariane / Retour */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={prophylaxisProgramsIndex.url()} className="hover:text-foreground transition-colors flex items-center gap-1">
                    <ArrowLeft size={14} /> Programmes
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Nouveau protocole</span>
            </div>

            {/* En-tête de page */}
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted ${strategy.colorClass}`}>
                    <ShieldPlus size={28} strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Créer un Programme Prophylactique</h1>
                    <p className="text-muted-foreground text-sm">Définissez un modèle de carnet de santé préventif réutilisable.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1 : Informations Générales */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-1">
                        <label className="text-sm font-medium text-card-foreground">Nom du programme</label>
                        <input 
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="Ex: Prophylaxie Pondeuses Standard"
                            className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                        />
                        {errors.name && <span className="text-destructive text-xs font-medium">{errors.name}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">Espèce / Type ciblé</label>
                        <select 
                            value={data.animal_type}
                            onChange={e => setData('animal_type', e.target.value)}
                            className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring font-medium"
                        >
                            <option value="pondeuse">Pondeuse</option>
                            <option value="chair">Poulet de chair</option>
                            <option value="porc">Porcin</option>
                        </select>
                        {errors.animal_type && <span className="text-destructive text-xs font-medium">{errors.animal_type}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">Statut d'activation</label>
                        <select 
                            value={data.is_active ? '1' : '0'}
                            onChange={e => setData('is_active', e.target.value === '1')}
                            className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring font-medium"
                        >
                            <option value="1">Actif (Prêt à l'usage)</option>
                            <option value="0">Inactif (Brouillon)</option>
                        </select>
                    </div>
                </div>

                {/* Section 2 : Édition des Étapes du Protocole */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border bg-muted/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Layers size={16} className="text-muted-foreground" />
                            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Planification des étapes</h2>
                        </div>
                        <button
                            type="button"
                            onClick={addStep}
                            className="flex items-center gap-1.5 text-xs font-bold bg-secondary text-secondary-foreground px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Plus size={14} /> Ajouter une étape
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted text-muted-foreground border-b border-border text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 w-28">Âge (Jours)</th>
                                    <th className="p-4 w-64">Famille de Soin / Médicament</th>
                                    <th className="p-4">Description de l'action / Posologie</th>
                                    <th className="p-4 w-36">Alerte (Jours avant)</th>
                                    <th className="p-4 w-16 text-center"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.steps.length > 0 ? (
                                    data.steps.map((step, index) => (
                                        <tr key={index} className="hover:bg-muted/30 transition-colors">
                                            {/* Écart de jours (day_offset) */}
                                            <td className="p-3">
                                                <input 
                                                    type="number" min="0"
                                                    value={step.day_offset}
                                                    onChange={e => updateStep(index, 'day_offset', Number(e.target.value))}
                                                    className="w-full bg-input border border-border rounded-md p-2 font-bold text-center"
                                                />
                                                {errors[`steps.${index}.day_offset` as keyof typeof errors] && (
                                                    <span className="text-destructive text-xs block mt-1">Requis</span>
                                                )}
                                            </td>

                                            {/* Catégorie Médicament */}
                                            <td className="p-3">
                                                <select
                                                    value={step.medication_category_id}
                                                    onChange={e => updateStep(index, 'medication_category_id', e.target.value)}
                                                    className="w-full bg-input border border-border rounded-md p-2"
                                                >
                                                    <option value="">Sélectionner</option>
                                                    {medicationCategories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                {errors[`steps.${index}.medication_category_id` as keyof typeof errors] && (
                                                    <span className="text-destructive text-xs block mt-1">Requis</span>
                                                )}
                                            </td>

                                            {/* Description technique */}
                                            <td className="p-3">
                                                <input 
                                                    type="text"
                                                    value={step.description}
                                                    onChange={e => updateStep(index, 'description', e.target.value)}
                                                    placeholder="Ex: Vaccin HB1 dans l'eau de boisson..."
                                                    className="w-full bg-input border border-border rounded-md p-2"
                                                />
                                            </td>

                                            {/* Pré-alerte calendrier */}
                                            <td className="p-3">
                                                <input 
                                                    type="number" min="0"
                                                    value={step.alert_days_before}
                                                    onChange={e => updateStep(index, 'alert_days_before', Number(e.target.value))}
                                                    className="w-full bg-input border border-border rounded-md p-2 text-center"
                                                />
                                            </td>

                                            {/* Bouton supprimer la ligne */}
                                            <td className="p-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeStep(index)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                                            Aucune étape configurée. Cliquez sur "Ajouter une étape" pour bâtir la timeline de soins.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Boutons de soumission */}
                <div className="flex justify-end gap-4">
                    <Link 
                        href={prophylaxisProgramsIndex.url()}
                        className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={processing || data.steps.length === 0}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
                    >
                        Créer le modèle de protocole
                    </button>
                </div>
            </form>
        </div>
    );
}
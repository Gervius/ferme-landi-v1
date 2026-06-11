// pages/Zootechnie/ProphylaxisProgram/Edit.tsx
import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Plus, Trash2, ShieldCheck, ArrowLeft, Layers } from 'lucide-react';
import { prophylaxisProgramsIndex, prophylaxisProgramsUpdate } from '@/routes';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';

interface ProphylaxisStep {
    id?: number;
    day_offset: number;
    medication_category_id: string | number;
    description: string;
    alert_days_before: number;
}

interface ProphylaxisProgram {
    id: number;
    name: string;
    animal_type: string;
    is_active: boolean;
    steps: ProphylaxisStep[];
}

interface Props {
    program: ProphylaxisProgram;
    medicationCategories: { id: number; name: string }[];
}

export default function Edit({ program, medicationCategories }: Props) {
    // Remplissage initial de useForm basé sur l'objet chargé
    const { data, setData, put, processing, errors } = useForm({
        name: program.name,
        animal_type: program.animal_type,
        is_active: Boolean(program.is_active),
        steps: program.steps.map(step => ({
            id: step.id,
            day_offset: step.day_offset,
            medication_category_id: step.medication_category_id,
            description: step.description || '',
            alert_days_before: step.alert_days_before,
        })),
    });

    const addStep = () => {
        const newStep: ProphylaxisStep = {
            day_offset: 0,
            medication_category_id: '',
            description: '',
            alert_days_before: 0,
        };
        setData('steps', [...data.steps, newStep]);
    };

    const removeStep = (index: number) => {
        const updatedSteps = data.steps.filter((_, i) => i !== index);
        setData('steps', updatedSteps);
    };

    const updateStep = (index: number, field: keyof ProphylaxisStep, value: any) => {
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
        put(prophylaxisProgramsUpdate.url(program.id));
    };

    const strategy = getGenerationDisplay(data.animal_type);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background text-foreground">
            {/* Fil d'Ariane */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href={prophylaxisProgramsIndex.url()} className="hover:text-foreground transition-colors flex items-center gap-1">
                    <ArrowLeft size={14} /> Programmes
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">Modifier le protocole</span>
            </div>

            {/* En-tête */}
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-muted ${strategy.colorClass}`}>
                    <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Ajuster le Programme Prophylactique</h1>
                    <p className="text-muted-foreground text-sm">Le modèle sera mis à jour. (Les modifications n'altèrent pas les calendriers déjà générés).</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Formulaire Général */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">Nom du programme</label>
                        <input 
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
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
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-card-foreground">Statut</label>
                        <select 
                            value={data.is_active ? '1' : '0'}
                            onChange={e => setData('is_active', e.target.value === '1')}
                            className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring font-medium"
                        >
                            <option value="1">Actif (Prêt)</option>
                            <option value="0">Inactif / Suspendu</option>
                        </select>
                    </div>
                </div>

                {/* Table des Étapes */}
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
                                {data.steps.map((step, index) => (
                                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-3">
                                            <input 
                                                type="number" min="0"
                                                value={step.day_offset}
                                                onChange={e => updateStep(index, 'day_offset', Number(e.target.value))}
                                                className="w-full bg-input border border-border rounded-md p-2 font-bold text-center"
                                            />
                                        </td>

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
                                        </td>

                                        <td className="p-3">
                                            <input 
                                                type="text"
                                                value={step.description}
                                                onChange={e => updateStep(index, 'description', e.target.value)}
                                                className="w-full bg-input border border-border rounded-md p-2"
                                            />
                                        </td>

                                        <td className="p-3">
                                            <input 
                                                type="number" min="0"
                                                value={step.alert_days_before}
                                                onChange={e => updateStep(index, 'alert_days_before', Number(e.target.value))}
                                                className="w-full bg-input border border-border rounded-md p-2 text-center"
                                            />
                                        </td>

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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions Formulaire */}
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
                        Mettre à jour le protocole
                    </button>
                </div>
            </form>
        </div>
    );
}
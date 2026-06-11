// pages/Zootechnie/FlockWeighing/Index.tsx
import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Scale, Activity } from 'lucide-react';
import { flockWeighingsStore, flockWeighingsApprove } from '@/routes';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FlockWeighing {
    id: number;
    date: string;
    average_weight: number;
    weighed_subjects_count: number;
    status: 'draft' | 'approved';
    generation: { id: number; code: string; type: string };
}

interface Generation {
    id: number;
    code: string;
    type: string;
}

interface Props {
    data: PaginatedData<FlockWeighing>;
    generations: Generation[];
}

export default function Index({ data, generations }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialisation du formulaire
    const { data: formData, setData, post, processing, errors, reset } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        average_weight: 0,
        weighed_subjects_count: 0,
    });

    // Soumission du formulaire (Brouillon)
    const submitCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(flockWeighingsStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    // Approbation de la pesée
    const handleApprove = (id: number) => {
        if (confirm("Valider cette pesée ? Elle sera inscrite définitivement dans l'historique de croissance du lot.")) {
            router.post(flockWeighingsApprove.url(id), {}, { preserveScroll: true });
        }
    };

    // Calculs rapides pour le Dashboard
    const stats = useMemo(() => {
        if (data.data.length === 0) return { avgWeight: 0, totalWeighed: 0 };
        
        let totalWeight = 0;
        let totalWeighed = 0;

        data.data.forEach(item => {
            totalWeighed += Number(item.weighed_subjects_count);
            // On fait une moyenne pondérée globale pour la page affichée
            totalWeight += Number(item.average_weight) * Number(item.weighed_subjects_count);
        });

        return {
            avgWeight: totalWeighed > 0 ? (totalWeight / totalWeighed).toFixed(2) : 0,
            totalWeighed
        };
    }, [data.data]);

    // Définition des colonnes du DataTable
    const columns: ColumnDef<FlockWeighing>[] = [
        { 
            header: 'Date', 
            className: 'font-medium',
            cell: (item) => new Date(item.date).toLocaleDateString()
        },
        { 
            header: 'Lot (Croissance)', 
            cell: (item) => {
                const { Icon, colorClass } = getGenerationDisplay(item.generation.type);
                return (
                    <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${colorClass}`} strokeWidth={2} />
                        <span className="font-semibold text-card-foreground">{item.generation.code}</span>
                    </div>
                );
            }
        },
        { 
            header: 'Échantillon pesé', 
            className: 'text-right',
            cell: (item) => (
                <span className="text-card-foreground font-medium">
                    {Number(item.weighed_subjects_count)} <span className="text-xs text-muted-foreground">têtes</span>
                </span>
            )
        },
        { 
            header: 'Poids Moyen', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-bold text-accent-foreground px-2 py-1 bg-accent/20 rounded-md">
                    {Number(item.average_weight).toFixed(2)} <span className="text-xs font-normal">Kg</span>
                </span>
            )
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                    item.status === 'approved' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-muted text-muted-foreground border border-border'
                }`}>
                    {item.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {item.status === 'approved' ? 'Validé' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => item.status === 'draft' ? (
                <button 
                    onClick={() => handleApprove(item.id)}
                    className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                >
                    Approuver
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic">Historisé</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            
            {/* Header & Statistiques */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Scale className="text-accent-foreground" /> Suivi des Pesées
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Évaluez la croissance et les performances d'engraissement de vos lots (Chair & Porcins).
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="bg-accent/20 p-2 rounded-lg text-accent-foreground">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Moyenne pondérée</p>
                            <p className="text-xl font-bold text-foreground">
                                {stats.avgWeight} <span className="text-sm font-normal text-muted-foreground">Kg</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barre d'action et Dialog */}
            <div className="flex justify-end mb-4">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                            <Plus size={18} />
                            Enregistrer une pesée
                        </button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-foreground flex items-center gap-2">
                                <Scale size={20} className="text-accent-foreground" /> Nouvelle Pesée
                            </DialogTitle>
                            <DialogDescription>
                                Saisissez le poids moyen de l'échantillon. Cette action sera enregistrée comme brouillon avant validation.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreate} className="space-y-6 mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Lot (Chair ou Porc)</label>
                                    <select 
                                        value={formData.generation_id}
                                        onChange={e => setData('generation_id', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    >
                                        <option value="">Sélectionner le lot</option>
                                        {generations.map(gen => {
                                            const { label } = getGenerationDisplay(gen.type);
                                            return <option key={gen.id} value={gen.id}>{gen.code} - {label}</option>;
                                        })}
                                    </select>
                                    {errors.generation_id && <span className="text-destructive text-xs">{errors.generation_id}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Date de la pesée</label>
                                    <input 
                                        type="date" 
                                        value={formData.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    />
                                    {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Têtes pesées</label>
                                        <input 
                                            type="number" min="1"
                                            value={formData.weighed_subjects_count || ''}
                                            onChange={e => setData('weighed_subjects_count', Number(e.target.value))}
                                            className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring font-medium"
                                            placeholder="Ex: 50"
                                        />
                                        {errors.weighed_subjects_count && <span className="text-destructive text-xs">{errors.weighed_subjects_count}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-accent-foreground">Poids Moyen (Kg)</label>
                                        <input 
                                            type="number" min="0.01" step="0.01"
                                            value={formData.average_weight || ''}
                                            onChange={e => setData('average_weight', Number(e.target.value))}
                                            className="w-full bg-accent/10 border border-accent/40 rounded-lg p-2.5 focus:ring-accent font-bold text-accent-foreground"
                                            placeholder="Ex: 1.85"
                                        />
                                        {errors.average_weight && <span className="text-destructive text-xs">{errors.average_weight}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-border">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-accent text-accent-foreground px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity shadow-sm"
                                >
                                    Enregistrer le brouillon
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* DataTable Universel */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucune pesée enregistrée pour le moment." 
            />
        </div>
    );
}
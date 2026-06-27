import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Scale, Activity } from 'lucide-react';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        average_weight: 0,
        weighed_subjects_count: 0,
    });

    // 🔴 TA LOGIQUE MÉTIER RÉTABLIE
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

    const openModal = () => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        // ROUTAGE STRICT : URI en dur
        post('/zootechnie/flock-weighings', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const approveWeighing = (id: number) => {
        if (confirm("Voulez-vous valider cette pesée ? Elle sera intégrée aux statistiques de croissance.")) {
            // ROUTAGE STRICT : URI en dur
            router.post(`/zootechnie/flock-weighings/${id}/approve`, {}, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    // Configuration des colonnes du DataTable
    const columns: ColumnDef<FlockWeighing>[] = useMemo(() => [
        { 
            header: 'Date', 
            cell: (row) => new Date(row.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) 
        },
        { 
            header: 'Lot (Génération)', 
            cell: (row) => {
                const strat = getGenerationDisplay(row.generation.type);
                return (
                    <div className="flex items-center gap-2 font-medium">
                        <strat.Icon size={16} className={strat.colorClass} />
                        {row.generation.code}
                    </div>
                );
            }
        },
        { 
            header: 'Poids Moyen', 
            cell: (row) => <span className="font-semibold text-accent-foreground">{row.average_weight} kg</span> 
        },
        { 
            header: 'Sujets Pesés', 
            cell: (row) => <span className="text-muted-foreground">{row.weighed_subjects_count}</span> 
        },
        {
            header: 'Statut',
            cell: (row) => row.status === 'approved'
                ? <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-md text-xs font-bold border border-green-200"><CheckCircle size={14}/> Validé</span>
                : <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-100 px-2 py-1 rounded-md text-xs font-bold border border-amber-200"><Clock size={14}/> Brouillon</span>
        },
        {
            header: 'Actions',
            cell: (row) => row.status === 'draft' && (
                <button
                    onClick={() => approveWeighing(row.id)}
                    className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1.5 transition-colors"
                >
                    <CheckCircle size={16} /> Approuver
                </button>
            )
        }
    ], []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
            {/* 🔴 TON DESIGN ORIGINAL RÉTABLI */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Scale className="text-accent-foreground" /> Suivi des Pesées
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Évaluez la croissance et les performances d'engraissement de vos lots (Chair & Porcins).
                    </p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
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

                    <button 
                        onClick={openModal}
                        className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-sm h-full"
                    >
                        <Plus size={18} />
                        Nouvelle Pesée
                    </button>
                </div>
            </div>

            {/* Modal de Saisie */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Scale className="text-accent" size={24} />
                            Enregistrer une pesée
                        </DialogTitle>
                        <DialogDescription>
                            Saisissez le poids moyen constaté sur un échantillon du lot.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitForm} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Date</label>
                                <input 
                                    type="date" 
                                    value={formData.date} 
                                    onChange={e => setData('date', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                />
                                {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Génération (Lot)</label>
                                <select 
                                    value={formData.generation_id} 
                                    onChange={e => setData('generation_id', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-primary"
                                >
                                    <option value="">Sélectionnez un lot</option>
                                    {generations.map(g => <option key={g.id} value={g.id}>{g.code} ({g.type})</option>)}
                                </select>
                                {errors.generation_id && <span className="text-destructive text-xs">{errors.generation_id}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-1"><Scale size={14}/> Poids Moyen (kg)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={formData.average_weight} 
                                    onChange={e => setData('average_weight', Number(e.target.value))} 
                                    className="w-full bg-input border border-border focus:border-primary focus:ring-primary rounded-md p-2 text-sm"
                                    placeholder="Ex: 1.85"
                                />
                                {errors.average_weight && <span className="text-destructive text-xs block">{errors.average_weight}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-1"><Activity size={14}/> Sujets Pesés</label>
                                <input 
                                    type="number" 
                                    value={formData.weighed_subjects_count} 
                                    onChange={e => setData('weighed_subjects_count', Number(e.target.value))} 
                                    className="w-full bg-input border border-border focus:border-primary focus:ring-primary rounded-md p-2 text-sm"
                                    placeholder="Taille de l'échantillon"
                                />
                                {errors.weighed_subjects_count && <span className="text-destructive text-xs block">{errors.weighed_subjects_count}</span>}
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

            {/* DataTable Universel */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucune pesée enregistrée pour le moment." 
            />
        </div>
    );
}
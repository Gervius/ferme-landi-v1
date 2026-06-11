// pages/Zootechnie/BreedStandard/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Target, Egg, Scale } from 'lucide-react';
import { breedStandardsStore, breedStandardsUpdate, breedStandardsDestroy } from '@/routes';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BreedStandard {
    id: number;
    target_laying_start_age: number;
    target_culling_age: number;
    peak_laying_rate: number;
    target_daily_feed_intake: number;
    breed: { id: number; name: string };
}

interface Props {
    standards: PaginatedData<BreedStandard>;
    breeds: { id: number; name: string }[];
}

export default function Index({ standards, breeds }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        breed_id: '',
        target_laying_start_age: 0,
        target_culling_age: 0,
        peak_laying_rate: 0,
        target_daily_feed_intake: 0,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (standard: BreedStandard) => {
        setEditingId(standard.id);
        setData({
            breed_id: standard.breed.id.toString(),
            target_laying_start_age: standard.target_laying_start_age,
            target_culling_age: standard.target_culling_age,
            peak_laying_rate: standard.peak_laying_rate,
            target_daily_feed_intake: standard.target_daily_feed_intake,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Supprimer ce standard ? Vous perdrez les données de comparaison pour cette race.")) {
            router.delete(breedStandardsDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(breedStandardsUpdate.url(editingId), {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); },
            });
        } else {
            post(breedStandardsStore.url(), {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); },
            });
        }
    };

    const columns: ColumnDef<BreedStandard>[] = [
        { 
            header: 'Race ciblée', 
            cell: (item) => <span className="font-bold text-foreground">{item.breed.name}</span>
        },
        { 
            header: 'Pic de Ponte', 
            className: 'text-center',
            cell: (item) => (
                <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {item.peak_laying_rate}%
                </span>
            )
        },
        { 
            header: 'Âge Début Ponte', 
            className: 'text-center',
            cell: (item) => `${item.target_laying_start_age} jours`
        },
        { 
            header: 'Âge Réforme', 
            className: 'text-center',
            cell: (item) => `${item.target_culling_age} jours`
        },
        { 
            header: 'Conso. Journalière', 
            className: 'text-right',
            cell: (item) => <span className="font-medium text-accent-foreground">{item.target_daily_feed_intake} g/tête</span>
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex justify-end gap-3">
                    <button onClick={() => openEditModal(item)} className="text-muted-foreground hover:text-accent-foreground transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Target className="text-accent-foreground" /> Standards de Performance
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Définissez les objectifs (KPIs) pour l'analyse des écarts de production.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus size={18} /> Nouveau Standard
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier le standard' : 'Créer un standard'}</DialogTitle>
                        <DialogDescription>
                            Paramétrez les performances théoriques attendues par les accouveurs pour cette race.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Race applicable</label>
                            <select 
                                value={data.breed_id} 
                                onChange={e => setData('breed_id', e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                            >
                                <option value="">Sélectionner la race</option>
                                {breeds.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            {errors.breed_id && <span className="text-destructive text-xs">{errors.breed_id}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><Egg size={14}/> Pic de ponte (%)</label>
                                <input 
                                    type="number" min="0" max="100" step="0.01"
                                    value={data.peak_laying_rate || ''} 
                                    onChange={e => setData('peak_laying_rate', Number(e.target.value))}
                                    className="w-full bg-primary/5 border border-primary/20 rounded-lg p-2.5 focus:ring-primary text-primary font-bold"
                                />
                                {errors.peak_laying_rate && <span className="text-destructive text-xs">{errors.peak_laying_rate}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><Scale size={14}/> Aliment / tête (grammes)</label>
                                <input 
                                    type="number" min="0" step="0.1"
                                    value={data.target_daily_feed_intake || ''} 
                                    onChange={e => setData('target_daily_feed_intake', Number(e.target.value))}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring font-medium"
                                />
                                {errors.target_daily_feed_intake && <span className="text-destructive text-xs">{errors.target_daily_feed_intake}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Début de ponte (Jours)</label>
                                <input 
                                    type="number" min="0"
                                    value={data.target_laying_start_age || ''} 
                                    onChange={e => setData('target_laying_start_age', Number(e.target.value))}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                />
                                {errors.target_laying_start_age && <span className="text-destructive text-xs">{errors.target_laying_start_age}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Âge cible de réforme (Jours)</label>
                                <input 
                                    type="number" min="0"
                                    value={data.target_culling_age || ''} 
                                    onChange={e => setData('target_culling_age', Number(e.target.value))}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                />
                                {errors.target_culling_age && <span className="text-destructive text-xs">{errors.target_culling_age}</span>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</button>
                            <button type="submit" disabled={processing} className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:opacity-90 shadow-sm">
                                {editingId ? 'Enregistrer les modifications' : 'Créer le standard'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DataTable data={standards} columns={columns} emptyMessage="Aucun standard paramétré." />
        </div>
    );
}
// pages/Zootechnie/DailyProduction/Index.tsx
import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, EggOff, Egg } from 'lucide-react';
import { dailyProductionsStore, dailyProductionsApprove } from '@/routes';
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

interface DailyProduction {
    id: number;
    date: string;
    good_quantity: number;
    broken_quantity: number;
    status: 'draft' | 'approved';
    generation: { id: number; code: string; type: string };
    unit: { id: number; symbol: string };
    category?: { id: number; name: string };
}

interface Props {
    data: PaginatedData<DailyProduction>;
    generations: { id: number; code: string; type: string }[];
    categories: { id: number; name: string }[];
    units: { id: number; name: string; symbol: string }[];
}

export default function Index({ data, generations, categories, units }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialisation du formulaire
    const { data: formData, setData, post, processing, errors, reset } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        unit_id: '',
        item_category_id: '',
        good_quantity: 0,
        broken_quantity: 0,
    });

    // Soumission de la création (Brouillon)
    const submitCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(dailyProductionsStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    // Action d'approbation (Validation du stock)
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous l'approbation ? Cette action mettra à jour les stocks définitivement.")) {
            router.post(dailyProductionsApprove.url(id), {}, { preserveScroll: true });
        }
    };

    // Statistiques rapides optimisées en RAM
    const stats = useMemo(() => {
        return data.data.reduce(
            (acc, item) => {
                acc.good += Number(item.good_quantity);
                acc.broken += Number(item.broken_quantity);
                return acc;
            },
            { good: 0, broken: 0 }
        );
    }, [data.data]);

    // Définition des colonnes du DataTable
    const columns: ColumnDef<DailyProduction>[] = [
        { 
            header: 'Date', 
            className: 'font-medium',
            cell: (item) => new Date(item.date).toLocaleDateString()
        },
        { 
            header: 'Lot (Génération)', 
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
            header: 'Catégorie', 
            cell: (item) => item.category ? item.category.name : <span className="text-muted-foreground italic">Standard</span>
        },
        { 
            header: 'Collecte Saine', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-bold text-primary">
                    {Number(item.good_quantity)} <span className="text-xs font-normal text-muted-foreground">{item.unit.symbol}</span>
                </span>
            )
        },
        { 
            header: 'Casses / Rebuts', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-bold text-destructive">
                    {Number(item.broken_quantity)} <span className="text-xs font-normal text-muted-foreground">{item.unit.symbol}</span>
                </span>
            )
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                    item.status === 'approved' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-accent/10 text-accent-foreground border border-accent/20'
                }`}>
                    {item.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {item.status === 'approved' ? 'Approuvé' : 'Brouillon'}
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
                <span className="text-xs text-muted-foreground italic">Verrouillé</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            
            {/* Header & Statistiques */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Egg className="text-primary" /> Production Journalière
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Saisissez et validez la ponte de vos lots actifs.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary"><Egg size={20} /></div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sains</p>
                            <p className="text-xl font-bold text-foreground">{stats.good}</p>
                        </div>
                    </div>
                    <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="bg-destructive/10 p-2 rounded-lg text-destructive"><EggOff size={20} /></div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Casses</p>
                            <p className="text-xl font-bold text-foreground">{stats.broken}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barre de contrôle avec Dialog intégré */}
            <div className="flex justify-end mb-4">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                            <Plus size={18} />
                            Saisir une production
                        </button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-primary">Déclaration de Ponte</DialogTitle>
                            <DialogDescription>
                                Cette saisie sera enregistrée en mode "Brouillon". Elle ne mettra à jour les stocks qu'après approbation.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreate} className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground">Lot concerné (Pondeuses)</label>
                                    <select 
                                        value={formData.generation_id}
                                        onChange={e => setData('generation_id', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    >
                                        <option value="">Sélectionner un lot actif</option>
                                        {generations.map(gen => {
                                            const { label } = getGenerationDisplay(gen.type);
                                            return <option key={gen.id} value={gen.id}>{gen.code} - {label}</option>;
                                        })}
                                    </select>
                                    {errors.generation_id && <span className="text-destructive text-xs">{errors.generation_id}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Date de ramassage</label>
                                    <input 
                                        type="date" 
                                        value={formData.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    />
                                    {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Catégorie / Calibre</label>
                                    <select 
                                        value={formData.item_category_id}
                                        onChange={e => setData('item_category_id', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    >
                                        <option value="">Générique / Standard</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-primary">Œufs Sains (Bons)</label>
                                    <input 
                                        type="number" min="0" step="0.01"
                                        value={formData.good_quantity || ''}
                                        onChange={e => setData('good_quantity', Number(e.target.value))}
                                        className="w-full bg-primary/5 border border-primary/30 rounded-lg p-2.5 focus:ring-primary"
                                    />
                                    {errors.good_quantity && <span className="text-destructive text-xs">{errors.good_quantity}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-destructive">Casses et Rebuts</label>
                                    <input 
                                        type="number" min="0" step="0.01"
                                        value={formData.broken_quantity || ''}
                                        onChange={e => setData('broken_quantity', Number(e.target.value))}
                                        className="w-full bg-destructive/5 border border-destructive/30 rounded-lg p-2.5 focus:ring-destructive"
                                    />
                                    {errors.broken_quantity && <span className="text-destructive text-xs">{errors.broken_quantity}</span>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground">Unité de mesure de la saisie</label>
                                    <select 
                                        value={formData.unit_id}
                                        onChange={e => setData('unit_id', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    >
                                        <option value="">Sélectionner (ex: Alvéole de 30, Unité...)</option>
                                        {units.map(unit => <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>)}
                                    </select>
                                    {errors.unit_id && <span className="text-destructive text-xs">{errors.unit_id}</span>}
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
                                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    Enregistrer le brouillon
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tableau principal (Appel du DataTable Universel) */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucune production journalière enregistrée pour le moment." 
            />
        </div>
    );
}
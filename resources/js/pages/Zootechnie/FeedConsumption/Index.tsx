// pages/Zootechnie/FeedConsumption/Index.tsx
import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Wheat, Scale } from 'lucide-react';
import { feedConsumptionsStore, feedConsumptionsApprove } from '@/routes';
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

interface FeedConsumption {
    id: number;
    date: string;
    quantity: number;
    status: 'draft' | 'approved'; // Assumé via la logique de l'action LogFeedConsumptionAction
    generation: { id: number; code: string; type: string };
    unit: { id: number; symbol: string };
    category: { id: number; name: string };
}

interface Props {
    data: PaginatedData<FeedConsumption>;
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
        item_category_id: '',
        unit_id: '',
        quantity: 0,
    });

    // Soumission de la création (Brouillon)
    const submitCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(feedConsumptionsStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    // Action d'approbation (Déclenche la sortie de stock côté backend)
    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous l'approbation de cette consommation ? Le stock d'aliment sera déduit.")) {
            router.post(feedConsumptionsApprove.url(id), {}, { preserveScroll: true });
        }
    };

    // Calcul du volume total sur la page courante (RAM)
    const totalVolume = useMemo(() => {
        return data.data.reduce((sum, item) => sum + Number(item.quantity), 0);
    }, [data.data]);

    // Définition des colonnes du DataTable
    const columns: ColumnDef<FeedConsumption>[] = [
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
            header: 'Aliment distribué', 
            cell: (item) => <span className="text-card-foreground font-medium">{item.category.name}</span>
        },
        { 
            header: 'Quantité', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-bold text-secondary">
                    {Number(item.quantity)} <span className="text-xs font-normal text-muted-foreground">{item.unit.symbol}</span>
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
                    className="text-xs font-bold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity shadow-sm"
                >
                    Approuver
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic">Sortie validée</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            
            {/* Header & Statistiques */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Wheat className="text-secondary" /> Suivi de l'Alimentation
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Déclarez les rations distribuées pour mettre à jour les stocks d'aliments.</p>
                </div>

                <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                        <Scale size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Volume distribué</p>
                        <p className="text-xl font-bold text-foreground">
                            {totalVolume.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">unités</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Barre de contrôle avec Dialog intégré */}
            <div className="flex justify-end mb-4">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                            <Plus size={18} />
                            Saisir une ration
                        </button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-secondary">Distribution d'aliment</DialogTitle>
                            <DialogDescription>
                                Cette déclaration sera enregistrée en tant que brouillon. L'approbation est requise pour déduire la quantité du stock.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreate} className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground">Lot bénéficiaire</label>
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

                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground">Type d'aliment (Catégorie)</label>
                                    <select 
                                        value={formData.item_category_id}
                                        onChange={e => setData('item_category_id', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    >
                                        <option value="">Sélectionner l'aliment</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    {errors.item_category_id && <span className="text-destructive text-xs">{errors.item_category_id}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Date de distribution</label>
                                    <input 
                                        type="date" 
                                        value={formData.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    />
                                    {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                                </div>

                                <div className="space-y-2"></div> {/* Espaceur pour la grille */}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary">Quantité distribuée</label>
                                    <input 
                                        type="number" min="0" step="0.01"
                                        value={formData.quantity || ''}
                                        onChange={e => setData('quantity', Number(e.target.value))}
                                        className="w-full bg-secondary/5 border border-secondary/30 rounded-lg p-2.5 focus:ring-secondary font-bold"
                                        placeholder="Ex: 50"
                                    />
                                    {errors.quantity && <span className="text-destructive text-xs">{errors.quantity}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Unité de mesure</label>
                                    <select 
                                        value={formData.unit_id}
                                        onChange={e => setData('unit_id', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    >
                                        <option value="">Sélectionner (ex: Kg, Sac...)</option>
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
                                    className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity shadow-sm"
                                >
                                    Enregistrer le brouillon
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tableau principal (DataTable) */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucune consommation d'aliment n'a été enregistrée." 
            />
        </div>
    );
}
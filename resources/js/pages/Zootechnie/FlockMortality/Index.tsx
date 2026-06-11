// pages/Zootechnie/FlockMortality/Index.tsx
import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Skull, TrendingDown, AlertTriangle } from 'lucide-react';
import { flockMortalitiesStore, flockMortalitiesApprove } from '@/routes';
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

interface FlockMortality {
    id: number;
    date: string;
    quantity: number;
    cause?: string;
    estimated_financial_loss?: number;
    status: 'draft' | 'approved';
    generation: { id: number; code: string; type: string };
}

interface Generation {
    id: number;
    code: string;
    type: string;
    current_quantity: number;
}

interface Props {
    data: PaginatedData<FlockMortality>;
    generations: Generation[];
}

export default function Index({ data, generations }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialisation du formulaire
    const { data: formData, setData, post, processing, errors, reset } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        quantity: 0,
        cause: '',
        estimated_financial_loss: 0,
    });

    // UX : Récupérer le lot sélectionné pour afficher des infos d'aide dynamiques
    const selectedGeneration = useMemo(() => {
        if (!formData.generation_id) return null;
        return generations.find(g => g.id === Number(formData.generation_id)) || null;
    }, [formData.generation_id, generations]);

    // Soumission de la création (Brouillon)
    const submitCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(flockMortalitiesStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    // Action d'approbation (Déduit les animaux du cheptel)
    const handleApprove = (id: number) => {
        if (confirm("Valider définitivement cette perte ? Le nombre d'animaux vivants sera immédiatement déduit du lot.")) {
            router.post(flockMortalitiesApprove.url(id), {}, { preserveScroll: true });
        }
    };

    // Calculs agrégés pour le tableau de bord (RAM)
    const stats = useMemo(() => {
        return data.data.reduce(
            (acc, item) => {
                acc.totalDead += Number(item.quantity);
                acc.totalLoss += Number(item.estimated_financial_loss || 0);
                return acc;
            },
            { totalDead: 0, totalLoss: 0 }
        );
    }, [data.data]);

    // Définition des colonnes du DataTable
    const columns: ColumnDef<FlockMortality>[] = [
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
            header: 'Pertes', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-bold text-destructive">
                    {Number(item.quantity)} <span className="text-xs font-normal text-muted-foreground">têtes</span>
                </span>
            )
        },
        { 
            header: 'Cause suspectée', 
            cell: (item) => item.cause ? (
                <span className="text-sm text-card-foreground">{item.cause}</span>
            ) : (
                <span className="text-sm text-muted-foreground italic">Non renseignée</span>
            )
        },
        { 
            header: 'Perte estimée', 
            className: 'text-right',
            cell: (item) => item.estimated_financial_loss ? (
                <span className="font-medium text-foreground">
                    {Number(item.estimated_financial_loss).toLocaleString()} <span className="text-xs text-muted-foreground">FCFA</span>
                </span>
            ) : (
                <span className="text-muted-foreground">-</span>
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
                    className="text-xs font-bold bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity shadow-sm"
                >
                    Valider la perte
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic">Définitif</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            
            {/* Header & Statistiques */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Skull className="text-destructive" /> Registre de Mortalité
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Déclarez les pertes pour maintenir l'inventaire de vos lots à jour.
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="bg-destructive/10 p-2 rounded-lg text-destructive">
                            <TrendingDown size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pertes</p>
                            <p className="text-xl font-bold text-foreground">
                                {stats.totalDead} <span className="text-sm font-normal text-muted-foreground">têtes</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barre d'action et Dialog */}
            <div className="flex justify-end mb-4">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-destructive text-destructive-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                            <Plus size={18} />
                            Déclarer une mortalité
                        </button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-destructive flex items-center gap-2">
                                <AlertTriangle size={20} /> Nouvelle déclaration
                            </DialogTitle>
                            <DialogDescription>
                                Saisissez les informations relatives à la perte. L'opération restera en brouillon jusqu'à sa validation.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreate} className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground flex justify-between">
                                        Lot concerné
                                        {selectedGeneration && (
                                            <span className="text-xs text-primary font-bold">
                                                Vivants : {selectedGeneration.current_quantity} têtes
                                            </span>
                                        )}
                                    </label>
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
                                    <label className="text-sm font-medium text-foreground">Date du constat</label>
                                    <input 
                                        type="date" 
                                        value={formData.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    />
                                    {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-destructive">Nombre de têtes perdues</label>
                                    <input 
                                        type="number" min="1"
                                        max={selectedGeneration ? selectedGeneration.current_quantity : undefined}
                                        value={formData.quantity || ''}
                                        onChange={e => setData('quantity', Number(e.target.value))}
                                        className="w-full bg-destructive/5 border border-destructive/30 rounded-lg p-2.5 focus:ring-destructive font-bold text-destructive"
                                        placeholder="Ex: 3"
                                    />
                                    {errors.quantity && <span className="text-destructive text-xs">{errors.quantity}</span>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground">Cause de la mortalité</label>
                                    <input 
                                        type="text" 
                                        value={formData.cause}
                                        onChange={e => setData('cause', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                        placeholder="Ex: Étouffement, suspicion de maladie..."
                                    />
                                    {errors.cause && <span className="text-destructive text-xs">{errors.cause}</span>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground">
                                        Perte financière estimée (Optionnel)
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="number" min="0" step="0.01"
                                            value={formData.estimated_financial_loss || ''}
                                            onChange={e => setData('estimated_financial_loss', Number(e.target.value))}
                                            className="w-full bg-input border border-border rounded-lg p-2.5 pr-16 focus:ring-ring"
                                            placeholder="Ex: 15000"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                            FCFA
                                        </span>
                                    </div>
                                    {errors.estimated_financial_loss && <span className="text-destructive text-xs">{errors.estimated_financial_loss}</span>}
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
                                    className="bg-destructive text-destructive-foreground px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity shadow-sm"
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
                emptyMessage="Aucune perte déclarée." 
            />
        </div>
    );
}
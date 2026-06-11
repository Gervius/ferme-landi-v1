// pages/Zootechnie/FlockCulling/Index.tsx
import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, ArchiveRestore, TrendingDown } from 'lucide-react';
import { flockCullingsStore, flockCullingsApprove } from '@/routes';
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

interface FlockCulling {
    id: number;
    date: string;
    quantity_culled: number;
    reason?: string;
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
    data: PaginatedData<FlockCulling>;
    generations: Generation[];
}

export default function Index({ data, generations }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialisation du formulaire (attention à bien utiliser quantity_culled comme dans le Request backend)
    const { data: formData, setData, post, processing, errors, reset } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        quantity_culled: 0,
        reason: '',
    });

    // UX : Récupérer le lot sélectionné pour le plafond de saisie
    const selectedGeneration = useMemo(() => {
        if (!formData.generation_id) return null;
        return generations.find(g => g.id === Number(formData.generation_id)) || null;
    }, [formData.generation_id, generations]);

    // Soumission de la création (Brouillon)
    const submitCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(flockCullingsStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    // Action d'approbation (Déduit les animaux du cheptel)
    const handleApprove = (id: number) => {
        if (confirm("Valider cette réforme ? Les animaux seront définitivement sortis de l'inventaire de ce lot.")) {
            router.post(flockCullingsApprove.url(id), {}, { preserveScroll: true });
        }
    };

    // Calcul du total des animaux réformés
    const totalCulled = useMemo(() => {
        return data.data.reduce((sum, item) => sum + Number(item.quantity_culled), 0);
    }, [data.data]);

    // Définition des colonnes du DataTable
    const columns: ColumnDef<FlockCulling>[] = [
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
            header: 'Sujets réformés', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-bold text-secondary">
                    {Number(item.quantity_culled)} <span className="text-xs font-normal text-muted-foreground">têtes</span>
                </span>
            )
        },
        { 
            header: 'Motif', 
            cell: (item) => item.reason ? (
                <span className="text-sm text-card-foreground">{item.reason}</span>
            ) : (
                <span className="text-sm text-muted-foreground italic">Fin de cycle / Standard</span>
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
                    className="text-xs font-bold bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-secondary/90 transition-colors shadow-sm"
                >
                    Approuver
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic">Sortie actée</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            
            {/* Header & Statistiques */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <ArchiveRestore className="text-secondary" /> Gestion des Réformes
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Saisissez les sorties planifiées d'animaux (fin de ponte, faible productivité...).
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                            <TrendingDown size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Animaux réformés</p>
                            <p className="text-xl font-bold text-foreground">
                                {totalCulled} <span className="text-sm font-normal text-muted-foreground">têtes</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barre d'action et Dialog */}
            <div className="flex justify-end mb-4">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                            <Plus size={18} />
                            Nouvelle réforme
                        </button>
                    </DialogTrigger>
                    
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-secondary flex items-center gap-2">
                                <ArchiveRestore size={20} /> Déclarer une réforme
                            </DialogTitle>
                            <DialogDescription>
                                La déclaration sera ajoutée en brouillon. Sa validation déduira les animaux du lot.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={submitCreate} className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground flex justify-between">
                                        Lot concerné
                                        {selectedGeneration && (
                                            <span className="text-xs text-primary font-bold">
                                                Effectif actuel : {selectedGeneration.current_quantity}
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
                                    <label className="text-sm font-medium text-foreground">Date de la réforme</label>
                                    <input 
                                        type="date" 
                                        value={formData.date}
                                        onChange={e => setData('date', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    />
                                    {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-secondary">Nombre de sujets à retirer</label>
                                    <input 
                                        type="number" min="1"
                                        max={selectedGeneration ? selectedGeneration.current_quantity : undefined}
                                        value={formData.quantity_culled || ''}
                                        onChange={e => setData('quantity_culled', Number(e.target.value))}
                                        className="w-full bg-secondary/5 border border-secondary/30 rounded-lg p-2.5 focus:ring-secondary font-bold"
                                        placeholder="Ex: 50"
                                    />
                                    {errors.quantity_culled && <span className="text-destructive text-xs">{errors.quantity_culled}</span>}
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-medium text-foreground">Motif (Optionnel)</label>
                                    <input 
                                        type="text" 
                                        value={formData.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                        className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                        placeholder="Ex: Baisse de ponte, Tri de fin de lot..."
                                    />
                                    {errors.reason && <span className="text-destructive text-xs">{errors.reason}</span>}
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
                                    className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-secondary/90 transition-colors shadow-sm"
                                >
                                    Créer le brouillon
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Appel du DataTable avec la bonne casse pour le chemin */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucune réforme n'a été déclarée." 
            />
        </div>
    );
}
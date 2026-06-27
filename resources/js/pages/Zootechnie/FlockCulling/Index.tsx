import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, ArchiveRestore, TrendingDown, AlertTriangle } from 'lucide-react';
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

    // Initialisation du formulaire
    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        quantity_culled: 0,
        reason: '',
    });

    // 🔴 STATISTIQUES MÉTIER
    const stats = useMemo(() => {
        if (data.data.length === 0) return { totalCulled: 0 };
        
        let totalCulled = 0;

        data.data.forEach(item => {
            totalCulled += Number(item.quantity_culled);
        });

        return {
            totalCulled
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
        post('/zootechnie/flock-cullings', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const approveCulling = (id: number) => {
        if (confirm("Voulez-vous valider cette réforme ? L'effectif du lot sera définitivement réduit.")) {
            // ROUTAGE STRICT : URI en dur
            router.post(`/zootechnie/flock-cullings/${id}/approve`, {}, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    // Configuration des colonnes du DataTable
    const columns: ColumnDef<FlockCulling>[] = useMemo(() => [
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
            header: 'Têtes Réformées', 
            cell: (row) => <span className="font-bold text-secondary-foreground">{row.quantity_culled}</span> 
        },
        { 
            header: 'Raison', 
            cell: (row) => <span className="text-muted-foreground">{row.reason || '-'}</span> 
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
                    onClick={() => approveCulling(row.id)}
                    className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1.5 transition-colors"
                >
                    <CheckCircle size={16} /> Approuver
                </button>
            )
        }
    ], []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
            {/* Header et Statistiques (Design fidèle) */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <ArchiveRestore className="text-secondary" /> Déclarations de Réforme
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Sortez du cheptel les animaux en fin de cycle ou non performants.
                    </p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary-foreground">
                            <TrendingDown size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Réformes</p>
                            <p className="text-xl font-bold text-foreground">
                                {stats.totalCulled} <span className="text-sm font-normal text-muted-foreground">sujets retirés</span>
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={openModal}
                        className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-sm h-full"
                    >
                        <Plus size={18} />
                        Déclarer une réforme
                    </button>
                </div>
            </div>

            {/* Modal de Saisie */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <AlertTriangle className="text-secondary" size={24} />
                            Déclarer une réforme
                        </DialogTitle>
                        <DialogDescription>
                            Saisissez le nombre de sujets écartés du lot. L'effectif sera réduit lors de la validation.
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
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-secondary focus:border-secondary"
                                />
                                {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Génération (Lot)</label>
                                <select 
                                    value={formData.generation_id} 
                                    onChange={e => setData('generation_id', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-secondary"
                                >
                                    <option value="">Sélectionnez un lot</option>
                                    {generations.map(g => (
                                        <option key={g.id} value={g.id}>
                                            {g.code} ({g.current_quantity} vivants)
                                        </option>
                                    ))}
                                </select>
                                {errors.generation_id && <span className="text-destructive text-xs">{errors.generation_id}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-foreground flex items-center gap-1">
                                    <ArchiveRestore size={14}/> Nombre de sujets
                                </label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={formData.quantity_culled} 
                                    onChange={e => setData('quantity_culled', Number(e.target.value))} 
                                    className="w-full bg-input border-border focus:border-secondary focus:ring-secondary rounded-md p-2 text-sm"
                                    placeholder="Ex: 50"
                                />
                                {errors.quantity_culled && <span className="text-destructive text-xs block">{errors.quantity_culled}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Raison de la réforme</label>
                            <textarea 
                                value={formData.reason} 
                                onChange={e => setData('reason', e.target.value)} 
                                className="w-full bg-input border border-border rounded-md p-2 text-sm min-h-[80px] resize-none focus:ring-secondary focus:border-secondary"
                                placeholder="Fin de cycle de ponte, boiteries, sous-poids..."
                            />
                            {errors.reason && <span className="text-destructive text-xs">{errors.reason}</span>}
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
                                Créer le brouillon
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Appel du DataTable Universal */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucune réforme n'a été déclarée." 
            />
        </div>
    );
}
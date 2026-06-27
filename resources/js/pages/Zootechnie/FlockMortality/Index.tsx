import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Skull, TrendingDown, AlertTriangle } from 'lucide-react';
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
    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        quantity: 0,
        cause: '',
        estimated_financial_loss: '',
    });

    // 🔴 STATISTIQUES MÉTIER (Maintenues fidèlement)
    const stats = useMemo(() => {
        if (data.data.length === 0) return { totalDead: 0, totalLoss: 0 };
        
        let totalDead = 0;
        let totalLoss = 0;

        data.data.forEach(item => {
            totalDead += Number(item.quantity);
            totalLoss += Number(item.estimated_financial_loss || 0);
        });

        return {
            totalDead,
            totalLoss: totalLoss.toFixed(2)
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
        post('/zootechnie/flock-mortalities', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const approveMortality = (id: number) => {
        if (confirm("Voulez-vous valider cette mortalité ? L'effectif du lot sera définitivement réduit.")) {
            // ROUTAGE STRICT : URI en dur
            router.post(`/zootechnie/flock-mortalities/${id}/approve`, {}, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    // Configuration des colonnes du DataTable
    const columns: ColumnDef<FlockMortality>[] = useMemo(() => [
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
            header: 'Pertes (Têtes)', 
            cell: (row) => <span className="font-bold text-destructive">{row.quantity}</span> 
        },
        { 
            header: 'Cause', 
            cell: (row) => <span className="text-muted-foreground">{row.cause || '-'}</span> 
        },
        { 
            header: 'Perte Financière', 
            cell: (row) => (
                <span className="font-medium text-amber-600">
                    {row.estimated_financial_loss ? `${row.estimated_financial_loss} FCFA` : '-'}
                </span>
            ) 
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
                    onClick={() => approveMortality(row.id)}
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
                        <Skull className="text-destructive" /> Déclarations de Mortalité
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Suivez les pertes de votre cheptel et ajustez vos effectifs en temps réel.
                    </p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="bg-destructive/10 p-2 rounded-lg text-destructive">
                            <TrendingDown size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Têtes Perdues</p>
                            <p className="text-xl font-bold text-foreground">
                                {stats.totalDead} <span className="text-sm font-normal text-muted-foreground">sujets</span>
                            </p>
                        </div>
                        <div className="h-8 w-px bg-border mx-2"></div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Perte Financière</p>
                            <p className="text-xl font-bold text-amber-600">
                                {stats.totalLoss} <span className="text-sm font-normal text-muted-foreground">FCFA</span>
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={openModal}
                        className="flex items-center gap-2 bg-destructive text-destructive-foreground px-5 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-sm h-full"
                    >
                        <Plus size={18} />
                        Déclarer une perte
                    </button>
                </div>
            </div>

            {/* Modal de Saisie */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <AlertTriangle className="text-destructive" size={24} />
                            Déclarer une mortalité
                        </DialogTitle>
                        <DialogDescription>
                            Saisissez les pertes constatées sur un lot. L'effectif sera mis à jour à la validation.
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
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-destructive focus:border-destructive"
                                />
                                {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Génération (Lot)</label>
                                <select 
                                    value={formData.generation_id} 
                                    onChange={e => setData('generation_id', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-destructive"
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
                                <label className="text-sm font-medium text-destructive flex items-center gap-1"><Skull size={14}/> Nombre de têtes perdues</label>
                                <input 
                                    type="number" 
                                    min="1"
                                    value={formData.quantity} 
                                    onChange={e => setData('quantity', Number(e.target.value))} 
                                    className="w-full bg-input border-destructive/50 focus:border-destructive focus:ring-destructive rounded-md p-2 text-sm"
                                    placeholder="Ex: 5"
                                />
                                {errors.quantity && <span className="text-destructive text-xs block">{errors.quantity}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-1"><TrendingDown size={14}/> Perte financière estimée</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    min="0"
                                    value={formData.estimated_financial_loss} 
                                    onChange={e => setData('estimated_financial_loss', e.target.value)} 
                                    className="w-full bg-input border border-border focus:border-destructive focus:ring-destructive rounded-md p-2 text-sm"
                                    placeholder="Valeur en FCFA"
                                />
                                {errors.estimated_financial_loss && <span className="text-destructive text-xs block">{errors.estimated_financial_loss}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Cause / Observations</label>
                            <textarea 
                                value={formData.cause} 
                                onChange={e => setData('cause', e.target.value)} 
                                className="w-full bg-input border border-border rounded-md p-2 text-sm min-h-[80px] resize-none focus:ring-destructive focus:border-destructive"
                                placeholder="Maladie présumée, incident matériel, prédateur..."
                            />
                            {errors.cause && <span className="text-destructive text-xs">{errors.cause}</span>}
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

            {/* DataTable Universel */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucune perte déclarée." 
            />
        </div>
    );
}
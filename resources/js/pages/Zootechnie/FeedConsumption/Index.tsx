import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Wheat, Scale } from 'lucide-react';
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

interface FeedConsumption {
    id: number;
    date: string;
    quantity: number;
    status: 'draft' | 'approved';
    generation: { id: number; code: string; type: string };
    unit: { id: number; symbol: string };
    item: { id: number; name: string }; // Remplacé : category devient item
}

interface Props {
    data: PaginatedData<FeedConsumption>;
    generations: { id: number; code: string; type: string }[];
    items: { id: number; name: string }[]; // Remplacé : categories devient items
    units: { id: number; name: string; symbol: string }[];
}

export default function Index({ data, generations, items, units }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialisation du formulaire
    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        unit_id: '',
        item_id: '', // Remplacé : item_category_id devient item_id
        quantity: 0,
    });

    const openModal = () => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        // ROUTAGE STRICT : URI en dur (0 latence liée à Ziggy)
        post('/zootechnie/feed-consumptions', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const approveConsumption = (id: number) => {
        if (confirm("Voulez-vous valider cette consommation ? Cela déduira la quantité des stocks d'entrepôt.")) {
            // ROUTAGE STRICT : URI en dur avec méthode POST/PUT selon ton web.php
            router.post(`/zootechnie/feed-consumptions/${id}/approve`, {}, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    // Configuration des colonnes du DataTable
    const columns: ColumnDef<FeedConsumption>[] = useMemo(() => [
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
            header: 'Aliment Consommé', 
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Wheat size={14} className="text-amber-600" />
                    {row.item?.name} {/* Remplacé : row.category.name devient row.item?.name */}
                </div>
            )
        },
        { 
            header: 'Quantité', 
            cell: (row) => <span className="font-semibold text-secondary-foreground">{row.quantity} {row.unit.symbol}</span> 
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
                    onClick={() => approveConsumption(row.id)}
                    className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1.5 transition-colors"
                >
                    <CheckCircle size={16} /> Approuver
                </button>
            )
        }
    ], []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Consommation Alimentaire</h1>
                    <p className="text-muted-foreground mt-1">Saisie des distributions d'aliments et mise à jour des stocks.</p>
                </div>
                <button 
                    onClick={openModal}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-sm"
                >
                    <Plus size={18} />
                    Saisir une distribution
                </button>
            </div>

            {/* Modal de Saisie (Shadcn Dialog) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Wheat className="text-amber-600" size={24} />
                            Déclarer une distribution d'aliment
                        </DialogTitle>
                        <DialogDescription>
                            Saisissez les quantités consommées par le lot aujourd'hui.
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
                                <label className="text-sm font-medium text-foreground">Type d'aliment</label>
                                <select 
                                    value={formData.item_id} 
                                    onChange={e => setData('item_id', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-primary"
                                >
                                    <option value="">Sélectionnez un aliment</option>
                                    {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </select>
                                {errors.item_id && <span className="text-destructive text-xs">{errors.item_id}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-1"><Scale size={14}/> Quantité</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={formData.quantity} 
                                        onChange={e => setData('quantity', Number(e.target.value))} 
                                        className="w-full bg-input border-border focus:border-primary focus:ring-primary rounded-md p-2 text-sm"
                                    />
                                    <select 
                                        value={formData.unit_id} 
                                        onChange={e => setData('unit_id', e.target.value)} 
                                        className="w-24 bg-input border border-border rounded-md p-2 text-sm focus:ring-primary shrink-0"
                                    >
                                        <option value="">Unité</option>
                                        {units.map(u => <option key={u.id} value={u.id}>{u.symbol}</option>)}
                                    </select>
                                </div>
                                {errors.quantity && <span className="text-destructive text-xs block">{errors.quantity}</span>}
                                {errors.unit_id && <span className="text-destructive text-xs block">{errors.unit_id}</span>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="bg-secondary text-secondary-foreground px-6 py-2 rounded-md text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity shadow-sm"
                            >
                                Enregistrer le brouillon
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Tableau via DataTable Component */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucune consommation d'aliment n'a été enregistrée." 
            />
        </div>
    );
}
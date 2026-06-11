// pages/Units/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Scale, GitMerge } from 'lucide-react';
import { unitsStore, unitsUpdate, unitsDestroy } from '@/routes';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Unit {
    id: number;
    name: string;
    symbol: string;
    is_base_unit: boolean;
    conversion_rate?: number;
    is_active: boolean;
    baseUnit?: { id: number; name: string; symbol: string };
}

interface Props {
    units: PaginatedData<Unit>;
    baseUnits: { id: number; name: string; symbol: string }[];
    unitTypes: { value: string; label: string }[];
}

export default function Index({ units, baseUnits, unitTypes }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        name: '',
        symbol: '',
        type: unitTypes.length > 0 ? unitTypes[0].value : '', // Initialisation dynamique
        is_base_unit: true,
        base_unit_id: '',
        conversion_rate: 1,
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Unit) => {
        setEditingId(item.id);
        setData({
            name: item.name,
            symbol: item.symbol,
            is_base_unit: Boolean(item.is_base_unit),
            base_unit_id: item.baseUnit?.id?.toString() || '',
            conversion_rate: item.conversion_rate || 1,
            is_active: Boolean(item.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Supprimer cette unité ? Attention aux conversions de stock existantes.")) {
            router.delete(unitsDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(unitsUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(unitsStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<Unit>[] = [
        { header: 'Nom', accessorKey: 'name', className: 'font-bold text-foreground' },
        { 
            header: 'Symbole', 
            cell: (item) => <span className="font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-md">{item.symbol}</span> 
        },
        { 
            header: 'Type de conversion', 
            cell: (item) => item.is_base_unit ? (
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Unité de Base</span>
            ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <GitMerge size={12} /> {item.conversion_rate} x {item.baseUnit?.symbol}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex justify-end gap-3">
                    <button onClick={() => openEditModal(item)} className="text-muted-foreground hover:text-secondary transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Scale className="text-secondary" /> Unités de Mesure
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gérez le référentiel des poids, volumes et conditionnements.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm">
                    <Plus size={18} /> Nouvelle Unité
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier l\'unité' : 'Créer une unité'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Nom complet</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring" placeholder="Ex: Kilogramme"/>
                                {errors.name && <span className="text-destructive text-xs">{errors.name}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Symbole</label>
                                <input type="text" value={data.symbol} onChange={e => setData('symbol', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring" placeholder="Ex: Kg"/>
                                {errors.symbol && <span className="text-destructive text-xs">{errors.symbol}</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 pb-2">
                            <input type="checkbox" id="is_base_unit" checked={data.is_base_unit} onChange={e => setData('is_base_unit', e.target.checked)} className="w-4 h-4 text-secondary focus:ring-ring border-border rounded" />
                            <label htmlFor="is_base_unit" className="text-sm font-medium text-foreground cursor-pointer">Ceci est une Unité de Base (ex: Kg, Pièce)</label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Catégorie de mesure</label>
                            <select 
                                value={data.type} 
                                onChange={e => setData('type', e.target.value)} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                            >
                                {unitTypes.map((typeOption) => (
                                    <option key={typeOption.value} value={typeOption.value}>
                                        {typeOption.label}
                                    </option>
                                ))}
                            </select>
                            {errors.type && <span className="text-destructive text-xs">{errors.type}</span>}
                        </div>

                        {!data.is_base_unit && (
                            <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg border border-border">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Unité de référence</label>
                                    <select value={data.base_unit_id} onChange={e => setData('base_unit_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring">
                                        <option value="">Sélectionner</option>
                                        {baseUnits.map(u => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Taux de conversion</label>
                                    <input type="number" step="0.001" value={data.conversion_rate} onChange={e => setData('conversion_rate', Number(e.target.value))} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring" placeholder="Ex: 30"/>
                                </div>
                                <div className="col-span-2 text-xs text-muted-foreground italic">
                                    Exemple : Si l'unité est "Alvéole" et la référence "Pièce", le taux est 30 (1 Alvéole = 30 Pièces).
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-6 border-t border-border">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</button>
                            <button type="submit" disabled={processing} className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:opacity-90">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DataTable data={units} columns={columns} emptyMessage="Aucune unité paramétrée." />
        </div>
    );
}
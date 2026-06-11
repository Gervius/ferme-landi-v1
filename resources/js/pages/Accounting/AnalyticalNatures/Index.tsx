// pages/Accounting/AnalyticalNatures/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Tag, AlignLeft } from 'lucide-react';
// Vérifie que ces routes sont bien dans ton fichier d'alias @/routes
import { analyticalNaturesStore, analyticalNaturesUpdate, analyticalNaturesDestroy } from '@/routes'; 
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

interface AnalyticalNature {
    id: number;
    code: string;
    name: string;
    is_active: boolean;
}

interface Props {
    analyticalNatures: PaginatedData<AnalyticalNature>; // Typé pour la pagination
}

export default function Index({ analyticalNatures }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        name: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (nature: AnalyticalNature) => {
        setEditingId(nature.id);
        setData({
            code: nature.code,
            name: nature.name,
            is_active: Boolean(nature.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Attention : Supprimer cette nature analytique peut casser vos rapports financiers. Confirmez-vous ?")) {
            router.delete(analyticalNaturesDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(analyticalNaturesUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(analyticalNaturesStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<AnalyticalNature>[] = [
        {
            header: 'Code Nature',
            cell: (item) => (
                <div className="flex items-center gap-2 font-mono font-black text-primary">
                    <Tag size={14} className="text-muted-foreground" />
                    {item.code.toUpperCase()}
                </div>
            )
        },
        {
            header: 'Intitulé',
            cell: (item) => (
                <div className="flex items-center gap-2 font-bold text-foreground">
                    <AlignLeft size={14} className="text-muted-foreground" />
                    {item.name}
                </div>
            )
        },
        {
            header: 'Statut',
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    item.is_active ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'
                }`}>
                    {item.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {item.is_active ? 'Actif' : 'Désactivé'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    <button onClick={() => openEditModal(item)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Tag className="text-primary" /> Natures Analytiques
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Définissez les types de charges (ex: CF pour Charges Fixes, CV pour Charges Variables).
                    </p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={18} /> Nouvelle Nature
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier la nature' : 'Créer une nature analytique'}</DialogTitle>
                        <DialogDescription>
                            Cette classification permettra de segmenter vos dépenses et revenus.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Code (Ex: CF, CV, DIR)</label>
                            <input 
                                type="text" 
                                value={data.code} 
                                onChange={e => setData('code', e.target.value.toUpperCase())} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary font-mono font-bold uppercase" 
                                placeholder="Code court..." 
                            />
                            {errors.code && <span className="text-destructive text-xs font-bold">{errors.code}</span>}
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Intitulé / Nom complet</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary" 
                                placeholder="Ex: Charges Fixes..." 
                            />
                            {errors.name && <span className="text-destructive text-xs font-bold">{errors.name}</span>}
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_active} 
                                    onChange={e => setData('is_active', e.target.checked)} 
                                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary" 
                                />
                                <span className="text-sm font-bold text-foreground">Cette nature est active</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Annuler
                            </button>
                            <button type="submit" disabled={processing} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors">
                                {editingId ? 'Mettre à jour' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DataTable data={analyticalNatures} columns={columns} emptyMessage="Aucune nature analytique n'a été configurée." />
        </div>
    );
}
// pages/Zootechnie/Species/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Dna, CheckCircle, XCircle } from 'lucide-react';
import { speciesStore, speciesUpdate, speciesDestroy } from '@/routes';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Species {
    id: number;
    name: string;
    is_active: boolean;
}

interface Props {
    species: PaginatedData<Species>;
}

export default function Index({ species }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Species) => {
        setEditingId(item.id);
        setData({
            name: item.name,
            is_active: Boolean(item.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Supprimer cette espèce ? Attention, cela impactera toutes les races et lots associés.")) {
            router.delete(speciesDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(speciesUpdate.url(editingId), {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); },
            });
        } else {
            post(speciesStore.url(), {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); },
            });
        }
    };

    const columns: ColumnDef<Species>[] = [
        { header: 'Nom de l\'espèce', accessorKey: 'name', className: 'font-bold text-foreground' },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                    item.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                    {item.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {item.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex justify-end gap-3">
                    <button onClick={() => openEditModal(item)} className="text-muted-foreground hover:text-primary transition-colors">
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
        <div className="p-6 max-w-5xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Dna className="text-primary" /> Espèces d'élevage
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gérez les grandes familles de votre cheptel (Volailles, Porcins...).</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus size={18} /> Nouvelle Espèce
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier l\'espèce' : 'Créer une espèce'}</DialogTitle>
                        <DialogDescription>
                            Définissez le nom de la famille d'animaux.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Nom (ex: Poulet, Porc)</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                            />
                            {errors.name && <span className="text-destructive text-xs">{errors.name}</span>}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="is_active"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-primary focus:ring-ring border-border rounded"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">
                                Espèce active
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</button>
                            <button type="submit" disabled={processing} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:bg-primary/90">
                                {editingId ? 'Mettre à jour' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DataTable data={species} columns={columns} emptyMessage="Aucune espèce paramétrée." />
        </div>
    );
}
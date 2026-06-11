// pages/Zootechnie/Breed/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Component, CheckCircle, XCircle } from 'lucide-react';
import { breedsStore, breedsUpdate, breedsDestroy } from '@/routes';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Breed {
    id: number;
    name: string;
    is_active: boolean;
    species: { id: number; name: string };
}

interface Props {
    breeds: PaginatedData<Breed>;
    species: { id: number; name: string }[];
}

export default function Index({ breeds, species }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        species_id: '',
        name: '',
        is_active: true,
    });

    // Ouvre la modale en mode Création
    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    // Ouvre la modale en mode Édition en pré-remplissant les données
    const openEditModal = (breed: Breed) => {
        setEditingId(breed.id);
        setData({
            species_id: breed.species.id.toString(),
            name: breed.name,
            is_active: Boolean(breed.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Supprimer cette race ? Cela pourrait affecter les lots historiques.")) {
            router.delete(breedsDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(breedsUpdate.url(editingId), {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); },
            });
        } else {
            post(breedsStore.url(), {
                preserveScroll: true,
                onSuccess: () => { setIsModalOpen(false); reset(); },
            });
        }
    };

    const columns: ColumnDef<Breed>[] = [
        { header: 'Nom de la race / souche', accessorKey: 'name', className: 'font-bold text-foreground' },
        { 
            header: 'Espèce d\'appartenance', 
            cell: (item) => <span className="text-muted-foreground font-medium">{item.species.name}</span> 
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                    item.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                    {item.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {item.is_active ? 'Actif' : 'Inactif'}
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
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Component className="text-primary" /> Races & Souches
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Paramétrez les variétés génétiques de vos élevages.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus size={18} /> Nouvelle Race
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier la race' : 'Créer une race'}</DialogTitle>
                        <DialogDescription>
                            Renseignez les informations de cette variété génétique.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Espèce</label>
                            <select 
                                value={data.species_id} 
                                onChange={e => setData('species_id', e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                            >
                                <option value="">Sélectionner l'espèce</option>
                                {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            {errors.species_id && <span className="text-destructive text-xs">{errors.species_id}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Nom de la Race / Souche</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                placeholder="Ex: Isa Brown, Cobb 500..."
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
                                Race active (visible à la création des lots)
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

            <DataTable data={breeds} columns={columns} emptyMessage="Aucune race paramétrée." />
        </div>
    );
}
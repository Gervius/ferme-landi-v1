// pages/Categories/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Tags, CornerDownRight, Filter } from 'lucide-react';
import { categoriesStore, categoriesUpdate, categoriesDestroy, categoriesIndex } from '@/routes';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Category {
    id: number;
    name: string;
    scope: string;
    parent?: { id: number; name: string };
}

interface Props {
    categories: PaginatedData<Category>;
    parents: { id: number; name: string; scope: string }[];
    filters: { scope?: string };
}

export default function Index({ categories, parents, filters }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        scope: filters.scope || 'product',
        parent_id: '',
    });

    const handleFilterChange = (scope: string) => {
        router.get(categoriesIndex.url(), { scope: scope || undefined }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setData('scope', filters.scope || 'product');
        setIsModalOpen(true);
    };

    const openEditModal = (item: Category) => {
        setEditingId(item.id);
        setData({
            name: item.name,
            scope: item.scope,
            parent_id: item.parent?.id?.toString() || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Supprimer cette catégorie ?")) {
            router.delete(categoriesDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(categoriesUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(categoriesStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const availableParents = parents.filter(p => p.scope === data.scope && p.id !== editingId);

    const columns: ColumnDef<Category>[] = [
        { header: 'Nom de la catégorie', accessorKey: 'name', className: 'font-bold text-foreground' },
        { 
            header: 'Domaine d\'application (Scope)', 
            cell: (item) => <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground bg-accent/20 px-2.5 py-1 rounded-full">{item.scope}</span>
        },
        { 
            header: 'Catégorie Parente', 
            cell: (item) => item.parent ? (
                <span className="flex items-center gap-1 text-sm text-muted-foreground"><CornerDownRight size={14} /> {item.parent.name}</span>
            ) : <span className="text-sm text-muted-foreground italic">- Racine -</span>
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex justify-end gap-3">
                    <button onClick={() => openEditModal(item)} className="text-muted-foreground hover:text-accent-foreground transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Tags className="text-accent-foreground" /> Catégories & Articles
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Classez vos produits finis, animaux, aliments et équipements.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* FILTRE MIS À JOUR */}
                    <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-xl shadow-sm">
                        <Filter size={16} className="text-muted-foreground ml-2" />
                        <select
                            value={filters.scope || ''}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 text-foreground pr-8 cursor-pointer"
                        >
                            <option value="">Tous les domaines</option>
                            <option value="animal">Animaux (Cheptel)</option>
                            <option value="feed">Alimentation (Sacs, Vrac)</option>
                            <option value="medication">Pharmacie (Vaccins, Soins)</option>
                            <option value="product">Produits & Ventes (Œufs...)</option>
                            <option value="equipment">Équipements & Matériel</option>
                        </select>
                    </div>

                    <button onClick={openCreateModal} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm">
                        <Plus size={18} /> Nouvelle
                    </button>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier la catégorie' : 'Créer une catégorie'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Domaine d'application</label>
                            {/* MENU DÉROULANT FORMULAIRE MIS À JOUR */}
                            <select value={data.scope} onChange={e => setData('scope', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring font-bold uppercase text-xs tracking-wider text-accent-foreground">
                                <option value="animal">Animaux (Cheptel)</option>
                                <option value="feed">Aliments Zootechniques</option>
                                <option value="medication">Médicaments & Vaccins</option>
                                <option value="product">Produits & Ventes</option>
                                <option value="equipment">Équipements & Matériel</option>
                            </select>
                            {errors.scope && <span className="text-destructive text-xs">{errors.scope}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Nom de la catégorie</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring" placeholder="Ex: Poussins, Vaccins, Œufs Calibre Moyen..."/>
                            {errors.name && <span className="text-destructive text-xs">{errors.name}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Sous-catégorie de (Optionnel)</label>
                            <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring">
                                <option value="">- Catégorie Principale (Racine) -</option>
                                {availableParents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</button>
                            <button type="submit" disabled={processing} className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:opacity-90">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DataTable data={categories} columns={columns} emptyMessage="Aucune catégorie trouvée." />
        </div>
    );
}
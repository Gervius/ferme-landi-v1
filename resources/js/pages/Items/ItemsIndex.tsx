import React, { useState, useMemo } from 'react';
import { router, useForm, Head } from '@inertiajs/react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    PackageSearch,
    Tags,
    Scale,
    AlertTriangle,
    Layers,
    CheckCircle, 
    XCircle,
    Package
} from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

// Interfaces
interface Category {
    id: number;
    name: string;
    scope: string;
}

interface Unit {
    id: number;
    name: string;
    symbol: string;
}

interface Item {
    id: number;
    category_id: number;
    default_unit_id: number;
    name: string;
    is_perishable: boolean;
    manage_by_batch: boolean;
    is_active: boolean;
    category?: Category;
    default_unit?: Unit;
}

interface Props {
    items: PaginatedData<Item>;
    categories: Category[];
    units: Unit[];
}

export default function ItemsIndex({ items, categories, units }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Initialisation du formulaire
    const { data: formData, setData, post, put, processing, errors, reset } = useForm({
        category_id: '',
        default_unit_id: '',
        name: '',
        is_perishable: false,
        manage_by_batch: false,
        is_active: true,
    });

    // Optimisation : Statistiques calculées uniquement si "items" change
    const stats = useMemo(() => {
        return items.data.reduce(
            (acc, item) => {
                if (item.is_active) acc.active += 1;
                if (item.is_perishable) acc.perishable += 1;
                return acc;
            },
            { active: 0, perishable: 0 }
        );
    }, [items.data]);

    // Optimisation : Mémorisation des options de Select
    const categoryOptions = useMemo(() => categories?.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
    )), [categories]);

    const unitOptions = useMemo(() => units?.map(unit => (
        <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
    )), [units]);

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Item) => {
        setEditingId(item.id);
        setData({
            category_id: item.category_id.toString(),
            default_unit_id: item.default_unit_id.toString(),
            name: item.name,
            is_perishable: Boolean(item.is_perishable),
            manage_by_batch: Boolean(item.manage_by_batch),
            is_active: Boolean(item.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            // Routage absolu Wayfinder
            router.delete(`/items/${id}`, { preserveScroll: true });
        }
    };

    // Typage strict avec SubmitEvent selon nos règles
    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            // Routage absolu Wayfinder
            put(`/items/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            // Routage absolu Wayfinder
            post('/items', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    // Définition des colonnes pour le DataTable
    const columns: ColumnDef<Item>[] = [
        {
            header: 'Article',
            cell: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted text-primary rounded-lg">
                        <Package size={18} />
                    </div>
                    <span className="font-bold text-foreground">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Catégorie',
            cell: (item) => (
                <span className="flex items-center gap-1.5 text-sm text-card-foreground">
                    <Tags size={14} className="text-muted-foreground" />
                    {item.category?.name || 'N/A'}
                </span>
            )
        },
        {
            header: 'Unité par défaut',
            cell: (item) => (
                <span className="flex items-center gap-1.5 text-sm text-card-foreground font-medium bg-muted px-2 py-1 rounded-md w-fit">
                    <Scale size={14} className="text-muted-foreground" />
                    {item.default_unit?.name} ({item.default_unit?.symbol})
                </span>
            )
        },
        {
            header: 'Propriétés',
            cell: (item) => (
                <div className="flex flex-col gap-1 text-xs">
                    {item.is_perishable && (
                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                            <AlertTriangle size={12} /> Périssable
                        </span>
                    )}
                    {item.manage_by_batch && (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                            <Layers size={12} /> Géré par lots
                        </span>
                    )}
                    {!item.is_perishable && !item.manage_by_batch && (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            )
        },
        {
            header: 'Statut',
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${
                    item.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                    {item.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {item.is_active ? 'Actif' : 'Inactif'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => openEditModal(item)} 
                        className="text-muted-foreground hover:text-secondary transition-colors"
                        title="Modifier"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <Head title="Catalogue des Articles" />
            
            {/* Header & KPIs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <PackageSearch className="text-primary" /> Catalogue des Articles
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gérez la nomenclature de vos stocks physiques (Aliments, Produits Vétérinaires, Ventes).
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="bg-card border border-border px-4 py-2 rounded-xl flex gap-4 shadow-sm text-sm">
                        <span className="text-muted-foreground font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Actifs : <span className="text-foreground font-bold">{stats.active}</span>
                        </span>
                        <span className="text-muted-foreground font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Périssables : <span className="text-foreground font-bold">{stats.perishable}</span>
                        </span>
                    </div>

                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                        <Plus size={18} />
                        Nouvel Article
                    </button>
                </div>
            </div>

            {/* Modale Unifiée de Gestion */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-foreground font-bold flex items-center gap-2">
                            <Package className="text-primary" size={24} />
                            {editingId ? "Modifier l'article" : "Créer un nouvel article"}
                        </DialogTitle>
                        <DialogDescription>
                            Configurez les propriétés physiques pour impacter correctement la gestion des stocks.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Cast TypeScript pour respecter l'usage exclusif de SubmitEvent */}
                    <form onSubmit={handleSubmit as unknown as React.FormEventHandler<HTMLFormElement>} className="space-y-4 mt-4">
                        
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-foreground">Nom de l'article</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                                placeholder="Ex: Sac de Maïs Concassé 50kg"
                            />
                            {errors.name && <span className="text-destructive text-xs font-medium">{errors.name}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Catégorie</label>
                                <select 
                                    value={formData.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Sélectionner...</option>
                                    {categoryOptions}
                                </select>
                                {errors.category_id && <span className="text-destructive text-xs font-medium">{errors.category_id}</span>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Unité par défaut</label>
                                <select 
                                    value={formData.default_unit_id}
                                    onChange={e => setData('default_unit_id', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Sélectionner...</option>
                                    {unitOptions}
                                </select>
                                {errors.default_unit_id && <span className="text-destructive text-xs font-medium">{errors.default_unit_id}</span>}
                            </div>
                        </div>

                        {/* Badges de configuration */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border mt-4">
                            <label className="flex items-center gap-2 cursor-pointer bg-muted/50 p-3 rounded-lg border border-border/50 hover:bg-muted transition-colors flex-1">
                                <input 
                                    type="checkbox" 
                                    checked={formData.is_perishable}
                                    onChange={e => setData('is_perishable', e.target.checked)}
                                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-border rounded"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">Périssable</span>
                                    <span className="text-xs text-muted-foreground">Vaccins, aliments frais</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer bg-muted/50 p-3 rounded-lg border border-border/50 hover:bg-muted transition-colors flex-1">
                                <input 
                                    type="checkbox" 
                                    checked={formData.manage_by_batch}
                                    onChange={e => setData('manage_by_batch', e.target.checked)}
                                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-border rounded"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">Géré par lots</span>
                                    <span className="text-xs text-muted-foreground">Traçabilité exigée</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="item_status"
                                checked={formData.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                            />
                            <label htmlFor="item_status" className="text-sm font-medium text-foreground cursor-pointer select-none">
                                Article actif dans le catalogue
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-4">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                {processing ? 'Traitement...' : (editingId ? 'Enregistrer les modifications' : 'Créer l\'article')}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Table Universelle */}
            <DataTable 
                data={items} 
                columns={columns} 
                emptyMessage="Aucun article n'est configuré dans le catalogue pour le moment." 
            />
        </div>
    );
}
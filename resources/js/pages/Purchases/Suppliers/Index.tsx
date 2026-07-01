// pages/Purchases/Supplier/Index.tsx
import React, { useState, useMemo } from 'react';
import { router, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Building2, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    CheckCircle, 
    XCircle, 
    Users
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

interface Supplier {
    id: number;
    name: string;
    contact_person: string | null;
    phone: string;
    email: string | null;
    address: string | null;
    is_active: boolean;
}

interface Props {
    data: PaginatedData<Supplier>; // Reçu du contrôleur Laravel
}

export default function Index({ data }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Initialisation du formulaire couplé aux règles du StoreSupplierRequest
    const { data: formData, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        is_active: true,
    });

    // Statistiques de la page calculées de manière optimale (RAM)
    const stats = useMemo(() => {
        return data.data.reduce(
            (acc, supplier) => {
                if (supplier.is_active) acc.active += 1;
                else acc.inactive += 1;
                return acc;
            },
            { active: 0, inactive: 0 }
        );
    }, [data.data]);

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (supplier: Supplier) => {
        setEditingId(supplier.id);
        setData({
            name: supplier.name,
            contact_person: supplier.contact_person || '',
            phone: supplier.phone,
            email: supplier.email || '',
            address: supplier.address || '',
            is_active: Boolean(supplier.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action peut impacter l'historique des commandes d'achat associés.")) {
            router.delete(`/purchases/suppliers/${id}`, { preserveScroll: true });
        }
    };

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/purchases/suppliers/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/purchases/suppliers', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    // Définition des colonnes pour le composant DataTable Universel
    const columns: ColumnDef<Supplier>[] = [
        {
            header: 'Raison Sociale / Nom',
            cell: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted text-secondary rounded-lg">
                        <Building2 size={18} />
                    </div>
                    <span className="font-bold text-foreground">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Contact Interne',
            cell: (item) => item.contact_person ? (
                <div className="flex items-center gap-1.5 text-sm text-card-foreground">
                    <User size={14} className="text-muted-foreground" />
                    {item.contact_person}
                </div>
            ) : (
                <span className="text-xs text-muted-foreground italic">Non renseigné</span>
            )
        },
        {
            header: 'Coordonnées',
            cell: (item) => (
                <div className="flex flex-col gap-0.5 text-xs">
                    <span className="flex items-center gap-1 text-card-foreground font-medium">
                        <Phone size={12} className="text-muted-foreground" /> {item.phone}
                    </span>
                    {item.email && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <Mail size={12} /> {item.email}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Adresse / Ville',
            cell: (item) => item.address ? (
                <span className="flex items-center gap-1 text-sm text-muted-foreground truncate max-w-[200px]">
                    <MapPin size={14} /> {item.address}
                </span>
            ) : (
                <span className="text-muted-foreground">-</span>
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
            
            {/* Header & Mini-KPIs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Building2 className="text-secondary" /> Base Fournisseurs
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gérez vos partenaires commerciaux pour les approvisionnements en aliments, poussins et traitements.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="bg-card border border-border px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm text-sm">
                        <Users size={16} className="text-muted-foreground" />
                        <span className="text-muted-foreground font-medium">
                            Partenaires actifs : <span className="text-foreground font-bold">{stats.active}</span>
                        </span>
                    </div>

                    <button 
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                        <Plus size={18} />
                        Nouveau Fournisseur
                    </button>
                </div>
            </div>

            {/* Modale Unique de Gestion (Création & Édition) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-foreground font-bold">
                            {editingId ? 'Modifier la fiche fournisseur' : 'Enregistrer un fournisseur'}
                        </DialogTitle>
                        <DialogDescription>
                            Complétez les coordonnées pour le suivi comptable et logistique des achats.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit as unknown as React.FormEventHandler<HTMLFormElement>} className="space-y-4 mt-4">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-foreground">Raison sociale / Nom complet</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary focus:border-secondary"
                                placeholder="Ex: Centrale d'Aliments du Faso"
                            />
                            {errors.name && <span className="text-destructive text-xs font-medium">{errors.name}</span>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-foreground">Interlocuteur / Contact Personne (Optionnel)</label>
                            <input 
                                type="text"
                                value={formData.contact_person}
                                onChange={e => setData('contact_person', e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary"
                                placeholder="Ex: M. Ouédraogo"
                            />
                            {errors.contact_person && <span className="text-destructive text-xs font-medium">{errors.contact_person}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">Téléphone</label>
                                <input 
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary"
                                    placeholder="Ex: +226 25 XX XX XX"
                                />
                                {errors.phone && <span className="text-destructive text-xs font-medium">{errors.phone}</span>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-foreground">E-mail (Optionnel)</label>
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary"
                                    placeholder="Ex: contact@entreprise.bf"
                                />
                                {errors.email && <span className="text-destructive text-xs font-medium">{errors.email}</span>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-foreground">Adresse Géographique (Optionnel)</label>
                            <textarea 
                                value={formData.address}
                                onChange={e => setData('address', e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary min-h-[70px] resize-none"
                                placeholder="Zone industrielle, Bobo-Dioulasso..."
                            />
                            {errors.address && <span className="text-destructive text-xs font-medium">{errors.address}</span>}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="supplier_status"
                                checked={formData.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-secondary focus:ring-secondary border-border rounded"
                            />
                            <label htmlFor="supplier_status" className="text-sm font-medium text-foreground cursor-pointer select-none">
                                Fournisseur actif (autorisé pour les commandes d'achat)
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-4">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                            >
                                {editingId ? 'Enregistrer les modifications' : 'Créer le fournisseur'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Injection de la Table Universelle */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucun partenaire de type fournisseur n'est enregistré pour le moment." 
            />
        </div>
    );
}
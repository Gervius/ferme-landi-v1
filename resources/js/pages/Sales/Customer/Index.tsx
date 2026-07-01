// pages/Sales/Customer/Index.tsx
import React, { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Users, User, Phone, Mail, MapPin } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

interface Customer {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    is_active: boolean;
}

interface Props {
    data: PaginatedData<Customer>;
}

export default function Index({ data }: Props) {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data: formData, setData, post, put, processing, errors, reset } = useForm({
        // site_id: auth.user.current_site_id, <-- À SUPPRIMER
        name: '',
        phone: '',
        email: '',
        address: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        // setData('site_id', auth.user.current_site_id); <-- À SUPPRIMER
        setIsModalOpen(true);
    };

    const openEditModal = (customer: Customer) => {
        setEditingId(customer.id);
        setData({
            // site_id: auth.user.current_site_id, <-- À SUPPRIMER
            name: customer.name,
            phone: customer.phone,
            email: customer.email || '',
            address: customer.address || '',
            is_active: Boolean(customer.is_active),
        });
        setIsModalOpen(true);
    };


    const handleDelete = (id: number) => {
        if (confirm("Supprimer ce client ?")) {
            // Lien en dur
            router.delete(`/sales/customers/${id}`, { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            // Lien en dur
            put(`/sales/customers/${editingId}`, { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            // Lien en dur
            post('/sales/customers', { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<Customer>[] = [
        {
            header: 'Client',
            cell: (item) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted text-secondary rounded-lg"><User size={18} /></div>
                    <span className="font-bold text-foreground">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Coordonnées',
            cell: (item) => (
                <div className="flex flex-col gap-0.5 text-xs">
                    <span className="flex items-center gap-1 font-medium"><Phone size={12} className="text-muted-foreground" /> {item.phone}</span>
                    {item.email && <span className="flex items-center gap-1 text-muted-foreground"><Mail size={12} /> {item.email}</span>}
                </div>
            )
        },
        {
            header: 'Adresse',
            cell: (item) => item.address ? <span className="text-sm text-muted-foreground">{item.address}</span> : '-'
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
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Users className="text-secondary" /> Gestion des Clients
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Annuaire de vos partenaires commerciaux et acheteurs.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm">
                    <Plus size={18} /> Nouveau Client
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier le client' : 'Créer un client'}</DialogTitle>
                        <DialogDescription>Enregistrez les informations de facturation du client.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {/* Bloc d'erreur global (pour capter les échecs liés au site_id) */}
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-destructive/10 text-destructive text-xs font-bold p-3 rounded-lg">
                                {errors.name && <p>Erreur Nom : {errors.name}</p>}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Nom complet</label>
                            <input type="text" value={formData.name} onChange={e => setData('name', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary" placeholder="Ex: Marché Central..." />
                            {errors.name && <span className="text-destructive text-xs">{errors.name}</span>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Téléphone</label>
                            <input type="text" value={formData.phone} onChange={e => setData('phone', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary" />
                            {errors.phone && <span className="text-destructive text-xs">{errors.phone}</span>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">E-mail</label>
                            <input type="email" value={formData.email} onChange={e => setData('email', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary" />
                            {/* Ajout du retour d'erreur pour l'email */}
                            {errors.email && <span className="text-destructive text-xs">{errors.email}</span>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold">Adresse</label>
                            <textarea value={formData.address} onChange={e => setData('address', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-secondary min-h-[70px]" />
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t border-border">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Annuler</button>
                            <button type="submit" disabled={processing} className="bg-secondary text-secondary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:opacity-90">
                                {editingId ? 'Enregistrer' : 'Créer'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DataTable data={data} columns={columns} emptyMessage="Aucun client enregistré." />
        </div>
    );
}
// pages/Sites/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, MapPin, CheckCircle, XCircle, Building2 } from 'lucide-react';
import { sitesStore, sitesUpdate, sitesDestroy } from '@/routes';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Site {
    id: number;
    name: string;
    is_active: boolean;
    company: { id: number; name: string };
}

interface Props {
    sites: PaginatedData<Site>;
    companies: { id: number; name: string }[];
    siteTypes: { value: string; label: string }[];
}

export default function Index({ sites, companies, siteTypes }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        company_id: '',
        name: '',
        type: siteTypes.length > 0 ? siteTypes[0].value : '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Site) => {
        setEditingId(item.id);
        setData({
            company_id: item.company?.id?.toString() || '',
            name: item.name,
            is_active: Boolean(item.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Supprimer ce site ? Cela impactera les lots et le stock rattachés.")) {
            router.delete(sitesDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(sitesUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(sitesStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<Site>[] = [
        { header: 'Nom du Site', accessorKey: 'name', className: 'font-bold text-foreground' },
        { 
            header: 'Entreprise affiliée', 
            cell: (item) => (
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Building2 size={14} /> {item.company?.name || 'N/A'}
                </span>
            ) 
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${item.is_active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
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
                    <button onClick={() => openEditModal(item)} className="text-muted-foreground hover:text-primary transition-colors"><Edit2 size={16} /></button>
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
                        <MapPin className="text-primary" /> Sites & Bâtiments
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gérez vos emplacements de production et de stockage.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={18} /> Nouveau Site
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier le site' : 'Créer un site'}</DialogTitle>
                        <DialogDescription>Paramétrez cet emplacement physique.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Entreprise Mère</label>
                            <select value={data.company_id} onChange={e => setData('company_id', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring">
                                <option value="">Sélectionner</option>
                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.company_id && <span className="text-destructive text-xs">{errors.company_id}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Type d'exploitation</label>
                            <select 
                                value={data.type} 
                                onChange={e => setData('type', e.target.value)} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                            >
                                {siteTypes.map((typeOption) => (
                                    <option key={typeOption.value} value={typeOption.value}>
                                        {typeOption.label}
                                    </option>
                                ))}
                            </select>
                            {errors.type && <span className="text-destructive text-xs">{errors.type}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Nom du Site</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring" placeholder="Ex: Ferme Ouest - Bâtiment A"/>
                            {errors.name && <span className="text-destructive text-xs">{errors.name}</span>}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 text-primary focus:ring-ring border-border rounded" />
                            <label htmlFor="is_active" className="text-sm font-medium text-foreground cursor-pointer">Site actif (disponible pour l'exploitation)</label>
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

            <DataTable data={sites} columns={columns} emptyMessage="Aucun site paramétré." />
        </div>
    );
}
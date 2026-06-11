// pages/Accounting/Accounts/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, BookOpen, Hash, CheckCircle, XCircle, FileText } from 'lucide-react';
// Assure-toi que ces routes sont bien exportées dans ton fichier @/routes
import { accountsStore, accountsUpdate, accountsDestroy } from '@/routes'; 
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

interface Account {
    id: number;
    number: string;
    name: string;
    is_active: boolean;
}

interface Props {
    accounts: PaginatedData<Account>; // Typage aligné avec la correction paginate(15)
}

export default function Index({ accounts }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        number: '',
        name: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (account: Account) => {
        setEditingId(account.id);
        setData({
            number: account.number,
            name: account.name,
            is_active: Boolean(account.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Attention : Supprimer un compte comptable peut corrompre les écritures qui y sont liées. Confirmez-vous ?")) {
            router.delete(accountsDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(accountsUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(accountsStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<Account>[] = [
        {
            header: 'Numéro de Compte',
            cell: (item) => (
                <div className="flex items-center gap-2 font-mono font-black text-foreground">
                    <Hash size={14} className="text-muted-foreground" />
                    {item.number}
                </div>
            )
        },
        {
            header: 'Intitulé du Compte',
            cell: (item) => (
                <div className="flex items-center gap-2 font-bold text-card-foreground">
                    <FileText size={14} className="text-muted-foreground" />
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
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BookOpen className="text-primary" /> Plan Comptable
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gérez l'arborescence et les numéros de comptes de votre entreprise.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={18} /> Nouveau Compte
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier le compte' : 'Créer un compte comptable'}</DialogTitle>
                        <DialogDescription>
                            Définissez la codification selon votre plan comptable (ex: SYSCOHADA).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Numéro de Compte</label>
                            <input 
                                type="text" 
                                value={data.number} 
                                onChange={e => setData('number', e.target.value)} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary font-mono font-bold" 
                                placeholder="Ex: 411100" 
                            />
                            {errors.number && <span className="text-destructive text-xs font-bold">{errors.number}</span>}
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Intitulé / Nom du compte</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary" 
                                placeholder="Ex: Clients - Ventes de volailles" 
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
                                <span className="text-sm font-bold text-foreground">Ce compte est actif (utilisable pour les saisies)</span>
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

            <DataTable data={accounts} columns={columns} emptyMessage="Le plan comptable est vide." />
        </div>
    );
}
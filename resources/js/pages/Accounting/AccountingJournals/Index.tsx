// pages/Accounting/AccountingJournals/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, BookDashed, Fingerprint, CheckCircle, XCircle, FileText } from 'lucide-react';
// Assure-toi que ces routes sont exportées dans ton fichier @/routes
import { accountingJournalsStore, accountingJournalsUpdate, accountingJournalsDestroy } from '@/routes'; 
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

interface AccountingJournal {
    id: number;
    code: string;
    name: string;
    is_active: boolean;
}

interface Props {
    accountingJournals: PaginatedData<AccountingJournal>; // Typage aligné avec la correction paginate(15)
}

export default function Index({ accountingJournals }: Props) {
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

    const openEditModal = (journal: AccountingJournal) => {
        setEditingId(journal.id);
        setData({
            code: journal.code,
            name: journal.name,
            is_active: Boolean(journal.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Attention : Supprimer un journal peut affecter l'historique de vos écritures comptables. Confirmez-vous ?")) {
            router.delete(accountingJournalsDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(accountingJournalsUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(accountingJournalsStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<AccountingJournal>[] = [
        {
            header: 'Code Journal',
            cell: (item) => (
                <div className="flex items-center gap-2 font-mono font-black text-primary">
                    <Fingerprint size={14} className="text-muted-foreground" />
                    {item.code.toUpperCase()}
                </div>
            )
        },
        {
            header: 'Intitulé du Journal',
            cell: (item) => (
                <div className="flex items-center gap-2 font-bold text-foreground">
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
                        <BookDashed className="text-primary" /> Journaux Comptables
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gérez les codes journaux (Achats, Ventes, Caisse, Banque...).</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={18} /> Nouveau Journal
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier le journal' : 'Créer un journal comptable'}</DialogTitle>
                        <DialogDescription>
                            Définissez le code (ex: ACH, VEN, CAIS) et le nom du journal.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Code Journal (Max 5 caractères)</label>
                            <input 
                                type="text" 
                                maxLength={5}
                                value={data.code} 
                                onChange={e => setData('code', e.target.value.toUpperCase())} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary font-mono font-bold uppercase" 
                                placeholder="Ex: ACH, VEN, BQ1" 
                            />
                            {errors.code && <span className="text-destructive text-xs font-bold">{errors.code}</span>}
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Intitulé / Nom du journal</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary" 
                                placeholder="Ex: Journal des Achats" 
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
                                <span className="text-sm font-bold text-foreground">Ce journal est actif pour les écritures</span>
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

            <DataTable data={accountingJournals} columns={columns} emptyMessage="Aucun journal comptable n'est paramétré." />
        </div>
    );
}
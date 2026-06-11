// pages/Accounting/AnalyticalCodes/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Hash, AlignLeft, LayoutTemplate } from 'lucide-react';
// Assure-toi que ces routes sont définies dans tes alias
import { analyticalCodesStore, analyticalCodesUpdate, analyticalCodesDestroy } from '@/routes'; 
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

interface AnalyticalCode {
    id: number;
    code: string;
    short_name: string;
    name: string;
    is_active: boolean;
}

interface Props {
    analyticalCodes: PaginatedData<AnalyticalCode>; // Typé avec la pagination
}

export default function Index({ analyticalCodes }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        short_name: '',
        name: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (codeItem: AnalyticalCode) => {
        setEditingId(codeItem.id);
        setData({
            code: codeItem.code,
            short_name: codeItem.short_name,
            name: codeItem.name,
            is_active: Boolean(codeItem.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Attention : Supprimer un code/section analytique peut impacter vos rapports. Confirmez-vous la suppression ?")) {
            router.delete(analyticalCodesDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(analyticalCodesUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(analyticalCodesStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<AnalyticalCode>[] = [
        {
            header: 'Code Section',
            cell: (item) => (
                <div className="flex items-center gap-2 font-mono font-black text-primary">
                    <Hash size={14} className="text-muted-foreground" />
                    {item.code.toUpperCase()}
                </div>
            )
        },
        {
            header: 'Nom Court (Abregé)',
            cell: (item) => (
                <span className="font-bold text-foreground bg-muted/50 px-2 py-1 rounded">
                    {item.short_name}
                </span>
            )
        },
        {
            header: 'Intitulé Complet',
            cell: (item) => (
                <div className="flex items-center gap-2 text-sm text-card-foreground">
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
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <LayoutTemplate className="text-primary" /> Codes & Sections Analytiques
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Définissez les grands départements d'activité (Ex: Aviculture, Porcherie, Agriculture).
                    </p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={18} /> Nouveau Code
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier la section' : 'Créer un code analytique'}</DialogTitle>
                        <DialogDescription>
                            Créez les grands axes de votre exploitation pour mieux ventiler vos écritures.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Code (Ex: AV, PO)</label>
                                <input 
                                    type="text" 
                                    value={data.code} 
                                    onChange={e => setData('code', e.target.value.toUpperCase())} 
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary font-mono font-bold uppercase" 
                                    placeholder="Ex: AV" 
                                />
                                {errors.code && <span className="text-destructive text-xs font-bold">{errors.code}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Nom Court</label>
                                <input 
                                    type="text" 
                                    value={data.short_name} 
                                    onChange={e => setData('short_name', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary font-bold" 
                                    placeholder="Ex: Aviculture" 
                                />
                                {errors.short_name && <span className="text-destructive text-xs font-bold">{errors.short_name}</span>}
                            </div>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Intitulé Complet / Description</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={e => setData('name', e.target.value)} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary" 
                                placeholder="Ex: Activité Avicole et Volailles" 
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
                                <span className="text-sm font-bold text-foreground">Cette section est active</span>
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

            <DataTable data={analyticalCodes} columns={columns} emptyMessage="Aucun code analytique n'a été créé." />
        </div>
    );
}
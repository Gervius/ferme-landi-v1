// pages/Accounting/AnalyticalCenters/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Target, AlignLeft, Tag, Hash } from 'lucide-react';
// Vérifie que ces routes sont bien dans ton fichier d'alias
import { analyticalCentersStore, analyticalCentersUpdate, analyticalCentersDestroy } from '@/routes'; 
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

interface AnalyticalCenter {
    id: number;
    short_name: string;
    name: string;
    is_active: boolean;
    nature: { id: number; code: string; name: string };
    analyticalCode: { id: number; code: string; name: string };
}

interface SelectionItem {
    id: number;
    code: string;
    name: string;
    short_name?: string;
}

interface Props {
    analyticalCenters: PaginatedData<AnalyticalCenter>;
    natures: SelectionItem[]; // Injecté via la modification du contrôleur
    codes: SelectionItem[];   // Injecté via la modification du contrôleur
}

export default function Index({ analyticalCenters, natures, codes }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        analytical_nature_id: '',
        analytical_code_id: '',
        short_name: '',
        name: '',
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (center: AnalyticalCenter) => {
        setEditingId(center.id);
        setData({
            analytical_nature_id: center.nature?.id.toString() || '',
            analytical_code_id: center.analyticalCode?.id.toString() || '',
            short_name: center.short_name,
            name: center.name,
            is_active: Boolean(center.is_active),
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Attention : Ce centre analytique est peut-être déjà utilisé dans des écritures comptables. Confirmez-vous sa suppression ?")) {
            router.delete(analyticalCentersDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(analyticalCentersUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(analyticalCentersStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<AnalyticalCenter>[] = [
        {
            header: 'Nom Court / Code',
            cell: (item) => (
                <div className="flex items-center gap-2 font-mono font-black text-primary">
                    <Target size={14} className="text-muted-foreground" />
                    {item.short_name.toUpperCase()}
                </div>
            )
        },
        {
            header: 'Intitulé Complet',
            cell: (item) => (
                <div className="flex items-center gap-2 font-bold text-foreground">
                    <AlignLeft size={14} className="text-muted-foreground" />
                    {item.name}
                </div>
            )
        },
        {
            header: 'Nature Analytique',
            cell: (item) => (
                <span className="text-xs font-medium bg-muted/50 text-muted-foreground px-2 py-1 rounded flex items-center gap-1 w-max">
                    <Tag size={12} /> {item.nature?.name}
                </span>
            )
        },
        {
            header: 'Section (Code)',
            cell: (item) => (
                <span className="text-xs font-medium bg-muted/50 text-muted-foreground px-2 py-1 rounded flex items-center gap-1 w-max">
                    <Hash size={12} /> {item.analyticalCode?.name}
                </span>
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
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Target className="text-primary" /> Centres Analytiques
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Définissez les centres de coûts et profits (Intersection entre Natures et Sections).
                    </p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={18} /> Nouveau Centre
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Modifier le centre' : 'Créer un centre analytique'}</DialogTitle>
                        <DialogDescription>
                            Rattachez ce centre à une Nature (ex: Charge Fixe) et une Section (ex: Aviculture).
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        
                        {/* Zone de rattachement */}
                        <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold uppercase text-muted-foreground text-xs tracking-wider">Nature Analytique</label>
                                <select 
                                    value={data.analytical_nature_id} 
                                    onChange={e => setData('analytical_nature_id', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary text-sm font-bold" 
                                >
                                    <option value="">Sélectionner la nature (Type)</option>
                                    {natures.map(n => <option key={n.id} value={n.id}>[{n.code}] - {n.name}</option>)}
                                </select>
                                {errors.analytical_nature_id && <span className="text-destructive text-[10px] font-bold">{errors.analytical_nature_id}</span>}
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold uppercase text-muted-foreground text-xs tracking-wider">Section Analytique (Code)</label>
                                <select 
                                    value={data.analytical_code_id} 
                                    onChange={e => setData('analytical_code_id', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary text-sm font-bold" 
                                >
                                    <option value="">Sélectionner la section (Département)</option>
                                    {codes.map(c => <option key={c.id} value={c.id}>[{c.code}] - {c.name}</option>)}
                                </select>
                                {errors.analytical_code_id && <span className="text-destructive text-[10px] font-bold">{errors.analytical_code_id}</span>}
                            </div>
                        </div>

                        {/* Identification */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5 md:col-span-1">
                                <label className="text-sm font-semibold">Nom Court</label>
                                <input 
                                    type="text" 
                                    value={data.short_name} 
                                    onChange={e => setData('short_name', e.target.value.toUpperCase())} 
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary font-mono font-bold uppercase" 
                                    placeholder="Ex: ALIM-POUSS" 
                                />
                                {errors.short_name && <span className="text-destructive text-xs font-bold">{errors.short_name}</span>}
                            </div>
                            
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-semibold">Intitulé Complet</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary" 
                                    placeholder="Ex: Alimentation Poussins" 
                                />
                                {errors.name && <span className="text-destructive text-xs font-bold">{errors.name}</span>}
                            </div>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_active} 
                                    onChange={e => setData('is_active', e.target.checked)} 
                                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary" 
                                />
                                <span className="text-sm font-bold text-foreground">Ce centre analytique est actif (utilisable dans les écritures)</span>
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

            <DataTable data={analyticalCenters} columns={columns} emptyMessage="Aucun centre analytique n'a été créé." />
        </div>
    );
}
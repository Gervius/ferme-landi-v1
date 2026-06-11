// pages/Accounting/FinancialYears/Index.tsx
import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Calendar, Lock, Unlock, ShieldAlert, CheckCircle } from 'lucide-react';
// Assure-toi que ces routes sont déclarées dans ton fichier d'alias
import { financialYearsStore, financialYearsUpdate, financialYearsDestroy, financialYearsClose } from '@/routes'; 
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';

interface FinancialYear {
    id: number;
    year: number;
    start_date: string;
    end_date: string;
    is_closed: boolean; // Supposé présent via ta table/modèle
}

interface Props {
    financialYears: PaginatedData<FinancialYear>; // Modifié pour supporter la pagination
}

export default function Index({ financialYears }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const currentYear = new Date().getFullYear();

    const { data, setData, post, put, processing, errors, reset } = useForm({
        year: currentYear,
        start_date: `${currentYear}-01-01`,
        end_date: `${currentYear}-12-31`,
    });

    const openCreateModal = () => {
        setEditingId(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (fy: FinancialYear) => {
        setEditingId(fy.id);
        setData({
            year: fy.year,
            start_date: fy.start_date.split('T')[0],
            end_date: fy.end_date.split('T')[0],
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Attention : Supprimer un exercice supprimera toutes les écritures liées. Confirmez-vous ?")) {
            router.delete(financialYearsDestroy.url(id), { preserveScroll: true });
        }
    };

    const handleCloseYear = (id: number) => {
        if (confirm("Clôturer cet exercice ? Cette action est IRRÉVERSIBLE. Toutes les écritures de cet exercice seront définitivement verrouillées.")) {
            router.post(financialYearsClose.url(id), {}, { preserveScroll: true });
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (editingId) {
            put(financialYearsUpdate.url(editingId), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        } else {
            post(financialYearsStore.url(), { onSuccess: () => { setIsModalOpen(false); reset(); }});
        }
    };

    const columns: ColumnDef<FinancialYear>[] = [
        {
            header: 'Année Fiscale',
            cell: (item) => (
                <div className="flex items-center gap-2 font-black text-lg text-primary">
                    <Calendar size={18} className="text-muted-foreground" />
                    {item.year}
                </div>
            )
        },
        {
            header: 'Période Couverte',
            cell: (item) => (
                <span className="text-sm font-medium text-muted-foreground">
                    Du {new Date(item.start_date).toLocaleDateString()} au {new Date(item.end_date).toLocaleDateString()}
                </span>
            )
        },
        {
            header: 'Statut',
            cell: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${
                    item.is_closed ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                }`}>
                    {item.is_closed ? <Lock size={12} /> : <Unlock size={12} />}
                    {item.is_closed ? 'Clôturé (Verrouillé)' : 'Ouvert (En cours)'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => item.is_closed ? (
                <span className="text-xs text-muted-foreground italic flex justify-end items-center gap-1">
                    <ShieldAlert size={14} /> Action impossible
                </span>
            ) : (
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => handleCloseYear(item.id)} 
                        className="bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
                        title="Clôturer l'exercice"
                    >
                        Clôturer
                    </button>
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
                        <Calendar className="text-primary" /> Exercices Comptables
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gérez les années fiscales et leur clôture annuelle.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus size={18} /> Nouvel Exercice
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Modifier l'exercice" : "Ouvrir un nouvel exercice comptable"}</DialogTitle>
                        <DialogDescription>
                            Définissez la période comptable de l'entreprise.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">Année (Millésime)</label>
                            <input 
                                type="number" 
                                value={data.year} 
                                onChange={e => setData('year', Number(e.target.value))} 
                                className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary font-bold text-lg text-primary" 
                                placeholder="Ex: 2026" 
                            />
                            {errors.year && <span className="text-destructive text-xs font-bold">{errors.year}</span>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Date de début</label>
                                <input 
                                    type="date" 
                                    value={data.start_date} 
                                    onChange={e => setData('start_date', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary" 
                                />
                                {errors.start_date && <span className="text-destructive text-xs font-bold">{errors.start_date}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">Date de fin</label>
                                <input 
                                    type="date" 
                                    value={data.end_date} 
                                    onChange={e => setData('end_date', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-primary" 
                                />
                                {errors.end_date && <span className="text-destructive text-xs font-bold">{errors.end_date}</span>}
                            </div>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 flex items-start gap-3 mt-4">
                            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-muted-foreground">
                                L'exercice sera créé à l'état "Ouvert". Vous pourrez y saisir des écritures comptables jusqu'à ce qu'il soit manuellement clôturé.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border mt-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Annuler
                            </button>
                            <button type="submit" disabled={processing} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors">
                                {editingId ? 'Mettre à jour' : 'Ouvrir l\'exercice'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <DataTable data={financialYears} columns={columns} emptyMessage="Aucun exercice comptable n'a été créé." />
        </div>
    );
}
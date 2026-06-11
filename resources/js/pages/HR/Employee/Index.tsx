// pages/HR/Employee/Index.tsx
import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Users, Briefcase, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'; // Ajuste le chemin si nécessaire

interface Site {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    site_id: number;
    first_name: string;
    last_name: string;
    position: string;
    hire_date: string;
    base_salary: number;
    is_active: boolean;
    site?: Site;
}

interface Props {
    data: PaginatedData<Employee>;
    sites: Site[];
}

export default function Index({ data, sites }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data: formData, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        site_id: '',
        first_name: '',
        last_name: '',
        position: '',
        hire_date: new Date().toISOString().split('T')[0],
        base_salary: 0,
        is_active: true,
    });

    const openCreateModal = () => {
        setModalMode('create');
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (employee: Employee) => {
        setModalMode('edit');
        setEditingId(employee.id);
        setData({
            site_id: employee.site_id.toString(),
            first_name: employee.first_name,
            last_name: employee.last_name,
            position: employee.position,
            hire_date: employee.hire_date.split('T')[0],
            base_salary: employee.base_salary,
            is_active: Boolean(employee.is_active),
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            reset();
            clearErrors();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Wayfinder : URI Pures
        if (modalMode === 'create') {
            post('/hr/employees', { onSuccess: () => setIsModalOpen(false) });
        } else {
            put(`/hr/employees/${editingId}`, { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Êtes-vous sûr de vouloir retirer cet employé ?")) {
            router.delete(`/hr/employees/${id}`, { preserveScroll: true });
        }
    };

    const columns: ColumnDef<Employee>[] = [
        { 
            header: 'Employé', 
            cell: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                        {item.first_name.charAt(0)}{item.last_name.charAt(0)}
                    </div>
                    <span className="font-bold text-foreground">{item.first_name} {item.last_name}</span>
                </div>
            ) 
        },
        { 
            header: 'Poste', 
            cell: (item) => (
                <div className="flex items-center gap-1.5 text-sm text-card-foreground">
                    <Briefcase size={14} className="text-muted-foreground" />
                    {item.position}
                </div>
            ) 
        },
        { 
            header: 'Site', 
            cell: (item) => (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {item.site?.name || '-'}
                </div>
            ) 
        },
        { 
            header: 'Date d\'embauche', 
            cell: (item) => new Date(item.hire_date).toLocaleDateString() 
        },
        { 
            header: 'Salaire de Base', 
            className: 'text-right',
            cell: (item) => (
                <span className="font-bold">
                    {Number(item.base_salary).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">FCFA</span>
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
                    {item.is_active ? 'Actif' : 'Inactif'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEditModal(item)} className="p-1.5 hover:bg-muted text-muted-foreground hover:text-primary rounded-lg transition-colors">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <Head title="Ressources Humaines" />
            
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Users className="text-primary" /> Ressources Humaines
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Gérez le personnel, les salaires et les affectations.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90">
                    <Plus size={18} /> Ajouter un Employé
                </button>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucun employé enregistré." />

            <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {modalMode === 'create' ? 'Nouvel Employé' : 'Modifier la fiche'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Nom</label>
                                <input type="text" value={formData.last_name} onChange={e => setData('last_name', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                                {errors.last_name && <p className="text-destructive text-[10px] font-bold">{errors.last_name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Prénom(s)</label>
                                <input type="text" value={formData.first_name} onChange={e => setData('first_name', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                                {errors.first_name && <p className="text-destructive text-[10px] font-bold">{errors.first_name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Poste / Fonction</label>
                                <input type="text" value={formData.position} onChange={e => setData('position', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                                {errors.position && <p className="text-destructive text-[10px] font-bold">{errors.position}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Site d'affectation</label>
                                <select value={formData.site_id} onChange={e => setData('site_id', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none">
                                    <option value="">Sélectionner un site...</option>
                                    {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                {errors.site_id && <p className="text-destructive text-[10px] font-bold">{errors.site_id}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Date d'embauche</label>
                                <input type="date" value={formData.hire_date} onChange={e => setData('hire_date', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                                {errors.hire_date && <p className="text-destructive text-[10px] font-bold">{errors.hire_date}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-primary">Salaire de Base (FCFA)</label>
                                <input type="number" min="0" step="1" value={formData.base_salary} onChange={e => setData('base_salary', Number(e.target.value))} className="w-full bg-primary/5 border border-primary/30 text-primary rounded-lg px-3 py-2.5 font-bold" />
                                {errors.base_salary && <p className="text-destructive text-[10px] font-bold">{errors.base_salary}</p>}
                            </div>
                            
                            <div className="col-span-1 md:col-span-2 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 text-primary border-border rounded focus:ring-primary" />
                                    <span className="text-sm font-bold text-foreground">Employé actif</span>
                                </label>
                            </div>
                        </div>

                        <DialogFooter className="mt-8">
                            <button type="button" onClick={() => handleOpenChange(false)} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                                Annuler
                            </button>
                            <button type="submit" disabled={processing} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm disabled:opacity-50 hover:opacity-90">
                                {processing ? 'Traitement...' : modalMode === 'create' ? 'Créer la fiche' : 'Sauvegarder'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
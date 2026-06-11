// pages/HR/PayrollRecord/Index.tsx
import React, { useState } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Banknote, CalendarDays, User } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
}

interface PayrollRecord {
    id: number;
    period_start: string;
    deductions: number | null;
    deduction_reason: string | null;
    status: 'draft' | 'approved';
    employee: Employee;
}

interface Props {
    data: PaginatedData<PayrollRecord>;
    employees: Employee[]; // Injecté par le Controller
}

export default function Index({ data, employees }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. SÉCURITÉ : Extraction propre des données globales sans conflit
    const { props: pageProps } = usePage();
    const flash = pageProps.flash as { success?: string; error?: string } | undefined;
    const pageErrors = pageProps.errors as Record<string, string>;

    // 2. SÉCURITÉ : Alias formErrors pour les erreurs du formulaire
    const { 
        data: formData, 
        setData, 
        post, 
        processing, 
        errors: formErrors, 
        reset, 
        clearErrors 
    } = useForm({
        employee_id: '',
        period_start: new Date().toISOString().split('T')[0],
        deductions: 0,
        deduction_reason: '',
    });

    const openCreateModal = () => {
        reset();
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
        post('/hr/payroll-records', { onSuccess: () => setIsModalOpen(false) });
    };

    const handleApprove = (id: number) => {
        if (confirm("Confirmez-vous la validation de cette fiche de paie et la génération de l'écriture comptable ?")) {
            router.post(`/hr/payroll-records/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    const formatPeriod = (dateString: string) => {
        if (!dateString) return '-'; // Anti-crash
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
    };

    const columns: ColumnDef<PayrollRecord>[] = [
        { 
            header: 'Employé', 
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    {/* Anti-crash avec le '?' */}
                    <span className="font-bold text-foreground">
                        {item.employee?.first_name} {item.employee?.last_name}
                    </span>
                </div>
            ) 
        },
        { 
            header: 'Période', 
            cell: (item) => (
                <div className="flex items-center gap-1.5 font-medium text-card-foreground capitalize">
                    <CalendarDays size={14} className="text-muted-foreground" />
                    {formatPeriod(item.period_start)}
                </div>
            ) 
        },
        { 
            header: 'Retenues', 
            className: 'text-right',
            cell: (item) => item.deductions && item.deductions > 0 ? (
                <div className="flex flex-col items-end">
                    <span className="font-bold text-destructive">
                        - {Number(item.deductions).toLocaleString()} <span className="text-xs font-normal">FCFA</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">{item.deduction_reason}</span>
                </div>
            ) : (
                <span className="text-muted-foreground text-sm">-</span>
            )
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
                    item.status === 'approved' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }`}>
                    {item.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {item.status === 'approved' ? 'Validée' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => item.status === 'draft' ? (
                <button onClick={() => handleApprove(item.id)} className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 shadow-sm transition-colors">
                    Approuver
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic px-2">Traitée</span>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            <Head title="Gestion de la Paie" />
            
            {/* Bannière Rouge pour les erreurs Back-end */}
            {pageErrors && Object.keys(pageErrors).length > 0 && (
                <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-xl text-sm font-bold shadow-sm">
                    {Object.values(pageErrors).map((err, index) => (
                        <p key={index} className="flex items-center gap-2">
                            <span>⚠️</span> {err as string}
                        </p>
                    ))}
                </div>
            )}

            {/* Bannière Verte pour les succès */}
            {flash?.success && (
                <div className="bg-primary/10 border border-primary text-primary p-4 rounded-xl text-sm font-bold shadow-sm">
                    <p className="flex items-center gap-2">
                        <span>✅</span> {flash.success}
                    </p>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Banknote className="text-primary" /> Gestion de la Paie
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">Générez et validez les fiches de paie de vos collaborateurs.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity">
                    <Plus size={18} /> Générer une fiche
                </button>
            </div>

            <DataTable data={data} columns={columns} emptyMessage="Aucune fiche de paie enregistrée." />

            <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nouvelle Fiche de Paie</DialogTitle>
                        <DialogDescription>
                            Saisissez les informations ci-dessous pour générer un brouillon de fiche de paie.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Employé</label>
                            <select value={formData.employee_id} onChange={e => setData('employee_id', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none">
                                <option value="">Sélectionner un employé...</option>
                                {/* Anti-crash sur la liste des employés */}
                                {employees?.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                                ))}
                            </select>
                            {formErrors.employee_id && <p className="text-destructive text-[10px] font-bold">{formErrors.employee_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Date de la paie</label>
                            <input type="date" value={formData.period_start} onChange={e => setData('period_start', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                            {formErrors.period_start && <p className="text-destructive text-[10px] font-bold">{formErrors.period_start}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Déductions / Avances (FCFA)</label>
                            <input type="number" min="0" step="1" value={formData.deductions} onChange={e => setData('deductions', Number(e.target.value))} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                            {formErrors.deductions && <p className="text-destructive text-[10px] font-bold">{formErrors.deductions}</p>}
                        </div>

                        {formData.deductions > 0 && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Motif de la déduction</label>
                                <input type="text" placeholder="Ex: Remboursement avance du 15/05" value={formData.deduction_reason} onChange={e => setData('deduction_reason', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                                {formErrors.deduction_reason && <p className="text-destructive text-[10px] font-bold">{formErrors.deduction_reason}</p>}
                            </div>
                        )}

                        <DialogFooter className="mt-8">
                            <button type="button" onClick={() => handleOpenChange(false)} className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                                Annuler
                            </button>
                            <button type="submit" disabled={processing} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm disabled:opacity-50 hover:opacity-90">
                                {processing ? 'Génération...' : 'Générer le brouillon'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
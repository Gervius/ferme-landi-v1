import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, CheckCircle, Clock, Stethoscope, Syringe, Pill } from 'lucide-react';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HealthTreatment {
    id: number;
    date: string;
    disease_description: string;
    medication_name: string;
    dosage_description: string;
    veterinarian_name?: string;
    status: 'draft' | 'approved';
    generation: { id: number; code: string; type: string };
    // NOUVEAUX CHAMPS OPTIONNELS (Stock physique)
    item?: { id: number; name: string };
    quantity?: number;
    unit?: { id: number; symbol: string };
}

interface Generation {
    id: number;
    code: string;
    type: string;
}

interface SelectionItem { 
    id: number; 
    name: string; 
    symbol?: string; 
}

interface Props {
    data: PaginatedData<HealthTreatment>;
    generations: Generation[];
    items: SelectionItem[]; // Ajouté pour le stock
    units: SelectionItem[]; // Ajouté pour le stock
}

export default function Index({ data, generations, items, units }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialisation du formulaire
    const { data: formData, setData, post, processing, errors, reset, clearErrors } = useForm({
        generation_id: '',
        date: new Date().toISOString().split('T')[0],
        disease_description: '',
        medication_name: '',
        dosage_description: '',
        veterinarian_name: '',
        item_id: '',
        quantity: '',
        unit_id: '',
    });

    const openModal = () => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Soumission de la création (Brouillon)
    const submitCreate = (e: React.SubmitEvent) => {
        e.preventDefault();
        // ROUTAGE STRICT : URI en dur
        post('/zootechnie/health-treatments', {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    // Action d'approbation
    const handleApprove = (id: number) => {
        if (confirm("Valider ce traitement ? Il sera inscrit définitivement dans le carnet de santé du lot.")) {
            // ROUTAGE STRICT : URI en dur
            router.post(`/zootechnie/health-treatments/${id}/approve`, {}, { preserveScroll: true });
        }
    };

    // Calcul rapide pour le Dashboard
    const stats = useMemo(() => {
        return {
            totalInterventions: data.data.length,
        };
    }, [data.data]);

    // Définition des colonnes du DataTable
    const columns: ColumnDef<HealthTreatment>[] = useMemo(() => [
        { 
            header: 'Date', 
            className: 'font-medium',
            cell: (item) => new Date(item.date).toLocaleDateString()
        },
        { 
            header: 'Lot (Patient)', 
            cell: (item) => {
                const { Icon, colorClass } = getGenerationDisplay(item.generation.type);
                return (
                    <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${colorClass}`} strokeWidth={2} />
                        <span className="font-semibold text-card-foreground">{item.generation.code}</span>
                    </div>
                );
            }
        },
        { 
            header: 'Maladie / Symptôme', 
            cell: (item) => (
                <span className="text-sm font-medium text-destructive">{item.disease_description}</span>
            )
        },
        { 
            header: 'Traitement & Dosage', 
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary flex items-center gap-1">
                        <Pill size={14} /> {item.medication_name}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">{item.dosage_description}</span>
                    {/* Affichage de l'impact sur le stock si applicable */}
                    {item.item && item.quantity && item.unit && (
                        <span className="text-[10px] uppercase font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded w-fit mt-1">
                            - {item.quantity} {item.unit.symbol} {item.item.name}
                        </span>
                    )}
                </div>
            )
        },
        { 
            header: 'Vétérinaire', 
            cell: (item) => item.veterinarian_name ? (
                <span className="text-sm text-card-foreground">{item.veterinarian_name}</span>
            ) : (
                <span className="text-sm text-muted-foreground italic">Interne</span>
            )
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                    item.status === 'approved' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-muted text-muted-foreground border border-border'
                }`}>
                    {item.status === 'approved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {item.status === 'approved' ? 'Validé' : 'Brouillon'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => item.status === 'draft' ? (
                <button 
                    onClick={() => handleApprove(item.id)}
                    className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                >
                    Approuver
                </button>
            ) : (
                <span className="text-xs text-muted-foreground italic">Historisé</span>
            )
        }
    ], []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background min-h-screen">
            
            {/* Header & Statistiques (Design fidèle conservé) */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Stethoscope className="text-primary" /> Santé & Soins
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Registre des interventions sanitaires et traitements curatifs.
                    </p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <div className="bg-card border border-border px-5 py-3 rounded-xl shadow-sm flex items-center gap-4 h-full">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Syringe size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Interventions</p>
                            {/* Ajustement pour refléter le total global si possible (data.total) sinon data.data.length */}
                            <p className="text-xl font-bold text-foreground">
                                {(data as any).total || stats.totalInterventions} <span className="text-sm font-normal text-muted-foreground">soins</span>
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={openModal}
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity h-full"
                    >
                        <Plus size={18} />
                        Déclarer un soin
                    </button>
                </div>
            </div>

            {/* Modal de création */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-primary flex items-center gap-2">
                            <Stethoscope size={20} /> Nouvelle Intervention
                        </DialogTitle>
                        <DialogDescription>
                            Saisissez les détails du traitement. Cette déclaration sera ajoutée en brouillon.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitCreate} className="space-y-6 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Lot traité</label>
                                <select 
                                    value={formData.generation_id}
                                    onChange={e => setData('generation_id', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                >
                                    <option value="">Sélectionner un lot actif</option>
                                    {generations.map(gen => {
                                        const { label } = getGenerationDisplay(gen.type);
                                        return <option key={gen.id} value={gen.id}>{gen.code} - {label}</option>;
                                    })}
                                </select>
                                {errors.generation_id && <span className="text-destructive text-xs">{errors.generation_id}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Date d'intervention</label>
                                <input 
                                    type="date" 
                                    value={formData.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                />
                                {errors.date && <span className="text-destructive text-xs">{errors.date}</span>}
                            </div>

                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium text-destructive">Maladie / Constat (Symptômes)</label>
                                <input 
                                    type="text" 
                                    value={formData.disease_description}
                                    onChange={e => setData('disease_description', e.target.value)}
                                    className="w-full bg-destructive/5 border border-destructive/30 text-foreground rounded-lg p-2.5 focus:ring-destructive"
                                    placeholder="Ex: Coccidiose, toux, diarrhée..."
                                />
                                {errors.disease_description && <span className="text-destructive text-xs">{errors.disease_description}</span>}
                            </div>

                            <div className="space-y-2 col-span-2">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 mt-2 border-b border-border pb-1">Protocole Médical</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-primary">Médicament / Produit</label>
                                <input 
                                    type="text" 
                                    value={formData.medication_name}
                                    onChange={e => setData('medication_name', e.target.value)}
                                    className="w-full bg-primary/5 border border-primary/30 rounded-lg p-2.5 focus:ring-primary font-bold text-primary"
                                    placeholder="Ex: Amprolium 20%"
                                />
                                {errors.medication_name && <span className="text-destructive text-xs">{errors.medication_name}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Posologie / Dosage</label>
                                <input 
                                    type="text" 
                                    value={formData.dosage_description}
                                    onChange={e => setData('dosage_description', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    placeholder="Ex: 1g / L d'eau pendant 5 jours"
                                />
                                {errors.dosage_description && <span className="text-destructive text-xs">{errors.dosage_description}</span>}
                            </div>

                            {/* NOUVEAU BLOC : Impact sur l'inventaire physique */}
                            <div className="space-y-2 col-span-2 mt-4 p-4 border border-border bg-muted/20 rounded-xl">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                    Impact sur les stocks (Optionnel)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-foreground">Article (Pharmacie)</label>
                                        <select 
                                            value={formData.item_id}
                                            onChange={e => setData('item_id', e.target.value)}
                                            className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-primary"
                                        >
                                            <option value="">Ne pas déduire du stock</option>
                                            {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                        </select>
                                        {errors.item_id && <span className="text-destructive text-xs">{errors.item_id}</span>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-foreground">Quantité consommée</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={formData.quantity}
                                            onChange={e => setData('quantity', e.target.value)}
                                            className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-primary"
                                            disabled={!formData.item_id}
                                        />
                                        {errors.quantity && <span className="text-destructive text-xs">{errors.quantity}</span>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-foreground">Unité</label>
                                        <select 
                                            value={formData.unit_id}
                                            onChange={e => setData('unit_id', e.target.value)}
                                            className="w-full bg-input border border-border rounded-md p-2 text-sm focus:ring-primary"
                                            disabled={!formData.item_id}
                                        >
                                            <option value="">Sélectionnez</option>
                                            {units.map(u => <option key={u.id} value={u.id}>{u.symbol}</option>)}
                                        </select>
                                        {errors.unit_id && <span className="text-destructive text-xs">{errors.unit_id}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <label className="text-sm font-medium text-foreground">Vétérinaire ou Responsable (Optionnel)</label>
                                <input 
                                    type="text" 
                                    value={formData.veterinarian_name}
                                    onChange={e => setData('veterinarian_name', e.target.value)}
                                    className="w-full bg-input border border-border rounded-lg p-2.5 focus:ring-ring"
                                    placeholder="Nom du praticien..."
                                />
                                {errors.veterinarian_name && <span className="text-destructive text-xs">{errors.veterinarian_name}</span>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-border">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-primary/90 transition-opacity shadow-sm"
                            >
                                Enregistrer le soin
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DataTable Universel */}
            <DataTable 
                data={data} 
                columns={columns} 
                emptyMessage="Aucun traitement sanitaire n'a été enregistré." 
            />
        </div>
    );
}
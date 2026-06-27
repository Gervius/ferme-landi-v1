// pages/Zootechnie/ProphylaxisProgram/Index.tsx
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, ShieldPlus, ShieldCheck, ShieldAlert } from 'lucide-react';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';
import { PaginatedData } from '@/types/pagination';
import { DataTable, ColumnDef } from '@/components/ui/DataTable';

interface ProphylaxisStep {
    id: number;
    day_offset: number;
    description: string;
    alert_days_before: number;
    medicationCategory: { id: number; name: string };
}

interface ProphylaxisProgram {
    id: number;
    name: string;
    animal_type: string;
    is_active: boolean;
    steps: ProphylaxisStep[];
}

interface Props {
    programs: PaginatedData<ProphylaxisProgram>;
}

export default function Index({ programs }: Props) {
    
    // Action de suppression
    const handleDelete = (id: number) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce programme ? Cela n'affectera pas les traitements déjà planifiés, mais il ne pourra plus être assigné à de nouveaux lots.")) {
            // ROUTAGE STRICT : URI en dur
            router.delete(`/zootechnie/prophylaxis-programs/${id}`, { preserveScroll: true });
        }
    };

    // Définition des colonnes du DataTable
    const columns: ColumnDef<ProphylaxisProgram>[] = [
        { 
            header: 'Nom du Programme', 
            className: 'font-bold text-primary',
            cell: (item) => item.name
        },
        { 
            header: 'Espèce cible', 
            cell: (item) => {
                const { Icon, label, colorClass } = getGenerationDisplay(item.animal_type);
                return (
                    <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${colorClass}`} strokeWidth={2} />
                        <span className="font-semibold text-card-foreground">{label}</span>
                    </div>
                );
            }
        },
        { 
            header: 'Étapes du protocole', 
            className: 'text-center',
            cell: (item) => (
                <span className="inline-flex items-center justify-center px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-xs font-bold">
                    {item.steps.length} étapes
                </span>
            )
        },
        { 
            header: 'Statut', 
            cell: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                    item.is_active 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                }`}>
                    {item.is_active ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    {item.is_active ? 'Actif' : 'Inactif'}
                </span>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            cell: (item) => (
                <div className="flex items-center justify-end gap-3">
                    <Link 
                        // ROUTAGE STRICT : URI en dur
                        href={`/zootechnie/prophylaxis-programs/${item.id}/edit`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title="Modifier le programme"
                    >
                        <Edit2 size={18} />
                    </Link>
                    <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-background">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <ShieldPlus className="text-primary" /> Programmes Prophylactiques
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Gérez les protocoles de vaccination et de soins préventifs par type d'animal.
                    </p>
                </div>

                <Link 
                    // ROUTAGE STRICT : URI en dur
                    href="/zootechnie/prophylaxis-programs/create"
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Créer un Programme
                </Link>
            </div>

            {/* DataTable Universel */}
            <DataTable 
                data={programs} 
                columns={columns} 
                emptyMessage="Aucun programme de prophylaxie n'a été créé. Cliquez sur 'Créer un Programme' pour commencer." 
            />
        </div>
    );
}
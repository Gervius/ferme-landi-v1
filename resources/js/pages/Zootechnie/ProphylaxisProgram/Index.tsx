import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Plus, ShieldPlus, Edit, Trash2, CheckCircle2, XCircle, Activity, GitCommitHorizontal } from 'lucide-react';
// À ajouter dans routes.ts : prophylaxisProgramsCreate, prophylaxisProgramsEdit, prophylaxisProgramsDestroy
import { prophylaxisProgramsCreate, prophylaxisProgramsEdit, prophylaxisProgramsDestroy } from '@/routes'; 

interface Step {
    id: number;
    day_offset: number;
    description: string;
    medicationCategory: { name: string };
}

interface Program {
    id: number;
    name: string;
    animal_type: string;
    is_active: boolean;
    steps: Step[];
}

interface Props {
    programs: {
        data: Program[];
    };
}

export default function ProphylaxisProgramIndex({ programs }: Props) {
    const { delete: destroy } = useForm();

    const breadcrumbs = [
        { title: 'Administration', href: '#' },
        { title: 'Prog. Prophylactiques', href: '#' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer ce programme ? Il ne sera plus appliqué aux futurs lots.')) {
            destroy(prophylaxisProgramsDestroy.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Prophylaxie" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={prophylaxisProgramsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Créer un Programme
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm max-w-6xl">
                <div className="p-4 border-b border-border bg-primary/5 flex items-center gap-2">
                    <ShieldPlus className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Programmes de Soins Préventifs</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Nom du Programme</th>
                            <th className="px-6 py-4">Espèce Cible</th>
                            <th className="px-6 py-4 text-center">Étapes (Soins)</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {programs.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    Aucun programme de prophylaxie configuré.
                                </td>
                            </tr>
                        ) : (
                            programs.data.map((prog) => (
                                <tr key={prog.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-black text-foreground">
                                        {prog.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded text-xs font-bold uppercase border border-secondary/20">
                                            {prog.animal_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground font-semibold text-xs">
                                            <GitCommitHorizontal className="w-3.5 h-3.5" />
                                            {prog.steps.length} interventions
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {prog.is_active ? (
                                            <span className="flex items-center gap-1 text-xs font-bold text-primary">
                                                <CheckCircle2 className="w-4 h-4" /> Actif
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                                <XCircle className="w-4 h-4" /> Inactif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link 
                                            href={prophylaxisProgramsEdit.url(prog.id)}
                                            className="p-2 text-muted-foreground hover:text-primary transition"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(prog.id)}
                                            className="p-2 text-muted-foreground hover:text-destructive transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
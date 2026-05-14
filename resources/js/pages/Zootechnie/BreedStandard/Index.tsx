import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Plus, Edit, Trash2, Target, Dna, Activity, Egg, Utensils } from 'lucide-react';
import { breedStandardsCreate, breedStandardsEdit, breedStandardsDestroy } from '@/routes';

interface BreedStandard {
    id: number;
    age_weeks: number;
    target_weight_kg: number | null;
    target_laying_rate: number | null;
    target_fcr: number | null; // Indice de consommation cible
    breed: {
        name: string;
        species: {
            name: string;
        };
    };
}

interface Props {
    standards: {
        data: BreedStandard[];
        links: any[];
    };
}

export default function BreedStandardIndex({ standards }: Props) {
    const { delete: destroy } = useForm();

    const breadcrumbs = [
        { title: 'Configuration ERP', href: '#' },
        { title: 'Standards de Race', href: '#' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer ce standard de performance ?')) {
            destroy(breedStandardsDestroy.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Standards" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={breedStandardsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un Standard
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Objectifs de Performance (Standards)</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Race / Souche</th>
                            <th className="px-6 py-4 text-center">Âge (Semaines)</th>
                            <th className="px-6 py-4 text-center" title="Poids cible">Poids Cible</th>
                            <th className="px-6 py-4 text-center" title="Taux de ponte cible">Taux Ponte</th>
                            <th className="px-6 py-4 text-center" title="Indice de Consommation cible">IC Cible</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {standards.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                    Aucun standard de race configuré.
                                </td>
                            </tr>
                        ) : (
                            standards.data.map((std) => (
                                <tr key={std.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-black text-foreground text-base">
                                            <Dna className="w-4 h-4 text-secondary" />
                                            {std.breed.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-muted/50 text-foreground px-2.5 py-1 rounded font-mono font-bold border border-border">
                                            {std.age_weeks} sem.
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium">
                                        {std.target_weight_kg ? (
                                            <span className="flex items-center justify-center gap-1 text-secondary-foreground">
                                                <Activity className="w-3.5 h-3.5 opacity-50" /> {std.target_weight_kg} kg
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium">
                                        {std.target_laying_rate ? (
                                            <span className="flex items-center justify-center gap-1 text-primary">
                                                <Egg className="w-3.5 h-3.5 opacity-50" /> {std.target_laying_rate}%
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium">
                                        {std.target_fcr ? (
                                            <span className="flex items-center justify-center gap-1 text-accent">
                                                <Utensils className="w-3.5 h-3.5 opacity-50" /> {std.target_fcr}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link 
                                            href={breedStandardsEdit.url(std.id)}
                                            className="p-2 text-muted-foreground hover:text-primary transition"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(std.id)}
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
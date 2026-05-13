import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Dna } from 'lucide-react';
// Assure-toi que speciesCreate, speciesEdit, speciesDestroy sont dans ton fichier routes.ts
import { speciesCreate, speciesEdit, speciesDestroy } from '@/routes'; 

interface Species {
    id: number;
    name: string;
    is_active: boolean;
}

interface Props {
    species: {
        data: Species[];
    };
}

export default function SpeciesIndex({ species }: Props) {
    const { delete: destroy } = useForm();

    const breadcrumbs = [
        { title: 'Administration', href: '#' },
        { title: 'Espèces', href: '#' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer cette espèce ?')) {
            destroy(speciesDestroy.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Espèces" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={speciesCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter Espèce
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm max-w-4xl">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                    <Dna className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Référentiel des Espèces</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Nom de l'Espèce</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {species.data.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-foreground">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4">
                                    {item.is_active ? (
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
                                        href={speciesEdit.url(item.id)}
                                        className="p-2 text-muted-foreground hover:text-primary transition"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Target } from 'lucide-react';
import { breedsCreate, breedsEdit, breedsDestroy } from '@/routes'; 

interface Breed {
    id: number;
    name: string;
    is_active: boolean;
    species: {
        name: string;
    };
}

interface Props {
    breeds: {
        data: Breed[];
    };
}

export default function BreedIndex({ breeds }: Props) {
    const { delete: destroy } = useForm();

    const breadcrumbs = [
        { title: 'Administration', href: '#' },
        { title: 'Races', href: '#' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer cette race ?')) {
            destroy(breedsDestroy.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Races" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={breedsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter Race
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm max-w-5xl">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Référentiel des Races / Souches</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Nom de la Race</th>
                            <th className="px-6 py-4">Espèce parente</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {breeds.data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Aucune race configurée.</td>
                            </tr>
                        ) : (
                            breeds.data.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-black text-foreground">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded text-xs font-bold uppercase border border-secondary/20">
                                            {item.species.name}
                                        </span>
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
                                            href={breedsEdit.url(item.id)}
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
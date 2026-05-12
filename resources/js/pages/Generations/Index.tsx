import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    Bird, 
    MapPin, 
    Calendar 
} from 'lucide-react';
import { generationsCreate, generationsEdit } from '@/routes';

// 1. Interfaces TypeScript basées sur le contrôleur de Jules
interface Site {
    id: number;
    name: string;
}

interface Breed {
    id: number;
    name: string;
}

interface Generation {
    id: number;
    code: string;
    type: 'pondeuse' | 'chair' | 'porc';
    start_date: string;
    initial_quantity: number;
    current_quantity: number;
    status: 'actif' | 'en_reforme' | 'cloture';
    site: Site;
    breed: Breed;
}

interface Props {
    generations: {
        data: Generation[];
        links: any[]; // Pour la pagination
    };
    auth: {
        user: any;
    };
}

export default function GenerationIndex({ generations, auth }: Props) {
    // Breadcrumbs pour la navigation
    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Générations', href: '#' },
    ];

    // Formattage du type d'animal
    const formatType = (type: string) => {
        const labels: Record<string, string> = {
            pondeuse: 'Pondeuses',
            chair: 'Poulets de Chair',
            porc: 'Porcins',
        };
        return labels[type] || type;
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Gestion des Lots" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={generationsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau Lot
                </Link>
            </div>

            {/* Cartes de statistiques rapides (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                    <p className="text-muted-foreground text-sm font-medium">Lots Actifs</p>
                    <p className="text-2xl font-bold text-foreground">
                        {generations.data.filter(g => g.status === 'actif').length}
                    </p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                    <p className="text-muted-foreground text-sm font-medium">Effectif Total</p>
                    <p className="text-2xl font-bold text-primary">
                        {generations.data.reduce((acc, g) => acc + g.current_quantity, 0).toLocaleString()} sujets
                    </p>
                </div>
            </div>

            {/* Liste des Générations */}
            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Code / Lot</th>
                            <th className="px-6 py-4">Espèce & Race</th>
                            <th className="px-6 py-4">Localisation</th>
                            <th className="px-6 py-4">Effectif actuel</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {generations.data.map((gen) => (
                            <tr key={gen.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-foreground">{gen.code}</div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(gen.start_date).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Bird className="w-4 h-4 text-accent" />
                                        <span className="font-medium">{formatType(gen.type)}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground ml-6">
                                        Race : {gen.breed.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-secondary" />
                                        {gen.site.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-foreground">
                                        {gen.current_quantity.toLocaleString()}
                                    </div>
                                    <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                                        <div 
                                            className="h-full bg-primary" 
                                            style={{ width: `${Math.min((gen.current_quantity / gen.initial_quantity) * 100, 100)}%` }}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                        gen.status === 'actif' 
                                        ? 'bg-primary/10 text-primary border-primary/20' 
                                        : 'bg-destructive/10 text-destructive border-destructive/20'
                                    }`}>
                                        {gen.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                        href={generationsEdit.url(gen.id)}
                                        className="text-muted-foreground hover:text-primary transition p-2 inline-block"
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
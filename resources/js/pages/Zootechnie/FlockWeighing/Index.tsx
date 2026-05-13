import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    Scale, 
    CheckCircle2, 
    Clock, 
    Check,
    Activity,
    Users
} from 'lucide-react';
import { flockWeighingsCreate, flockWeighingsApprove } from '@/routes'; // À ajouter dans ton routes.ts

interface Weighing {
    id: number;
    date: string;
    average_weight: number;
    weighed_subjects_count: number;
    status: 'draft' | 'approved';
    generation: {
        code: string;
        type: string;
    };
}

interface Props {
    data: {
        data: Weighing[];
    };
}

export default function FlockWeighingIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Pesée & Croissance', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Approuver cette pesée ? Elle servira de base pour calculer le poids moyen du lot dans les statistiques.')) {
            post(flockWeighingsApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Suivi de Croissance" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={flockWeighingsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Enregistrer une pesée
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Historique des Pesées (Échantillonnage)</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Date / Lot</th>
                            <th className="px-6 py-4">Espèce cible</th>
                            <th className="px-6 py-4 text-center">Poids Moyen (Kg)</th>
                            <th className="px-6 py-4 text-center">Sujets Pesés</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                    Aucune pesée n'a été enregistrée.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((w) => (
                                <tr key={w.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-foreground">
                                            {new Date(w.date).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                            Lot: {w.generation.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Utilisation de la couleur secondaire pour le type */}
                                        <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded text-[10px] font-bold uppercase border border-secondary/20">
                                            {w.generation.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-md text-accent-foreground font-black text-base">
                                            <Scale className="w-4 h-4" />
                                            {w.average_weight} kg
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1 text-muted-foreground font-medium">
                                            <Users className="w-4 h-4" />
                                            {w.weighed_subjects_count} sujets
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                            w.status === 'approved' 
                                            ? 'bg-primary/10 text-primary border-primary/20' 
                                            : 'bg-muted text-muted-foreground border-border'
                                        }`}>
                                            {w.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {w.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {w.status === 'draft' && (
                                            <button
                                                onClick={() => handleApprove(w.id)}
                                                disabled={processing}
                                                className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                                                title="Approuver la pesée"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
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
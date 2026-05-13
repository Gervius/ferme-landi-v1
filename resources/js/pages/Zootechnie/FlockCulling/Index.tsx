import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    LogOut, 
    CheckCircle2, 
    Clock, 
    Check,
    Scale,
    Tag
} from 'lucide-react';
import { flockCullingsCreate, flockCullingsApprove } from '@/routes';

interface Culling {
    id: number;
    date: string;
    quantity_culled: number;
    reason: string | null;
    weight_kg: number | null;
    status: 'draft' | 'approved';
    generation: {
        code: string;
        type: string;
    };
}

interface Props {
    data: {
        data: Culling[];
    };
}

export default function FlockCullingIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Réformes & Sorties', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Approuver cette réforme ? L\'effectif de la génération sera définitivement réduit.')) {
            post(flockCullingsApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Réformes" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={flockCullingsCreate.url()}
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Enregistrer une sortie
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-secondary/10 flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-secondary" />
                    <h2 className="font-bold text-lg text-foreground">Historique des Réformes</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Date / Lot</th>
                            <th className="px-6 py-4 text-center">Sujets Retirés</th>
                            <th className="px-6 py-4">Motif</th>
                            <th className="px-6 py-4 text-center">Poids Total (Kg)</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                    Aucune réforme enregistrée pour le moment.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((c) => (
                                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-foreground">
                                            {new Date(c.date).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                            Lot: {c.generation.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-1.5 font-black text-foreground">
                                            <LogOut className="w-4 h-4 text-secondary" />
                                            {c.quantity_culled}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                            <Tag className="w-3.5 h-3.5" />
                                            {c.reason || 'Non spécifié'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {c.weight_kg ? (
                                            <span className="bg-accent/10 text-accent-foreground px-2.5 py-1 rounded font-mono text-xs font-bold border border-accent/20">
                                                {c.weight_kg} kg
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground italic">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                            c.status === 'approved' 
                                            ? 'bg-primary/10 text-primary border-primary/20' 
                                            : 'bg-muted text-muted-foreground border-border'
                                        }`}>
                                            {c.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {c.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {c.status === 'draft' && (
                                            <button
                                                onClick={() => handleApprove(c.id)}
                                                disabled={processing}
                                                className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                                                title="Approuver la réforme"
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
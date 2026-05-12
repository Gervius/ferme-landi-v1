import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    Skull, 
    CheckCircle2, 
    Clock, 
    AlertTriangle,
    Check,
    TrendingDown,
    DollarSign
} from 'lucide-react';
import { flockMortalitiesCreate, flockMortalitiesApprove } from '@/routes';

interface Mortality {
    id: number;
    date: string;
    quantity: number;
    cause: string | null;
    estimated_financial_loss: number | null;
    status: 'draft' | 'approved';
    generation: {
        code: string;
        type: string;
    };
}

interface Props {
    data: {
        data: Mortality[];
        links: any[];
    };
}

export default function MortalityIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Suivi de Mortalité', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Confirmer cette déclaration ? L\'effectif vivant du lot sera mis à jour.')) {
            post(flockMortalitiesApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Mortalité" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={flockMortalitiesCreate.url()}
                    className="inline-flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Déclarer une perte
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Date / Lot</th>
                            <th className="px-6 py-4">Sujets</th>
                            <th className="px-6 py-4">Cause probable</th>
                            <th className="px-6 py-4">Perte Est.</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.map((m) => (
                            <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-foreground">
                                        {new Date(m.date).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase">
                                        {m.generation.code} ({m.generation.type})
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 font-bold text-destructive">
                                        <TrendingDown className="w-4 h-4" />
                                        {m.quantity}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground italic">
                                    {m.cause || "Non spécifiée"}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {m.estimated_financial_loss ? (
                                        <span className="flex items-center gap-1">
                                            {m.estimated_financial_loss.toLocaleString()} <span className="text-[10px] text-muted-foreground">FCFA</span>
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                        m.status === 'approved' 
                                        ? 'bg-primary/10 text-primary border-primary/20' 
                                        : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                                    }`}>
                                        {m.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {m.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {m.status === 'draft' && (
                                        <button
                                            onClick={() => handleApprove(m.id)}
                                            disabled={processing}
                                            className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                                            title="Approuver"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
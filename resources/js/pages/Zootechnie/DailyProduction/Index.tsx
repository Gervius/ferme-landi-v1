import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    CheckCircle2, 
    Clock, 
    Egg, 
    AlertTriangle,
    Check
} from 'lucide-react';
import { dailyProductionsCreate, dailyProductionsApprove } from '@/routes';

interface Production {
    id: number;
    date: string;
    good_quantity: number;
    broken_quantity: number;
    status: 'draft' | 'approved';
    generation: {
        code: string;
    };
    unit: {
        symbol: string;
    };
}

interface Props {
    data: {
        data: Production[];
    };
}

export default function DailyProductionIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Production d\'œufs', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Voulez-vous valider cette production ? Elle sera alors injectée en stock.')) {
            post(dailyProductionsApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Production" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={dailyProductionsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition"
                >
                    <Plus className="w-4 h-4" />
                    Saisir la collecte
                </Link>
            </div>

            {/* Liste des collectes */}
            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Date / Lot</th>
                            <th className="px-6 py-4 text-center">Bons Œufs</th>
                            <th className="px-6 py-4 text-center">Cassés</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.map((prod) => (
                            <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-foreground">
                                        {new Date(prod.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                                        Lot: {prod.generation.code}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center gap-1.5 font-bold text-primary">
                                        <Egg className="w-4 h-4" />
                                        {prod.good_quantity.toLocaleString()} {prod.unit.symbol}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center text-sm font-medium text-destructive/80">
                                    {prod.broken_quantity > 0 ? (
                                        <span className="flex justify-center items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            {prod.broken_quantity}
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {prod.status === 'approved' ? (
                                        <span className="flex items-center gap-1 text-primary text-xs font-bold uppercase">
                                            <CheckCircle2 className="w-4 h-4" /> Approuvé
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-muted-foreground text-xs font-bold uppercase">
                                            <Clock className="w-4 h-4" /> Brouillon
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {prod.status === 'draft' && (
                                        <button
                                            onClick={() => handleApprove(prod.id)}
                                            disabled={processing}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-md shadow-sm transition disabled:opacity-50"
                                            title="Approuver la production"
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
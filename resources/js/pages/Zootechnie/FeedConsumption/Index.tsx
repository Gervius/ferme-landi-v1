import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    Utensils, 
    CheckCircle2, 
    Clock, 
    Check,
    Package
} from 'lucide-react';
import { feedConsumptionsCreate, feedConsumptionsApprove } from '@/routes';

interface Consumption {
    id: number;
    date: string;
    quantity: number;
    total_base_quantity: number;
    status: 'draft' | 'approved';
    generation: {
        code: string;
        type: string;
    };
    unit: {
        symbol: string;
    };
    category: {
        name: string;
    };
}

interface Props {
    data: {
        data: Consumption[];
        links?: any[];
    };
}

export default function FeedConsumptionIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Consommation d\'Aliment', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm("Approuver cette distribution ? Le stock d'aliment sera définitivement déduit.")) {
            post(feedConsumptionsApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Alimentation" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={feedConsumptionsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg font-black transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Distribuer Aliment
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-secondary/5 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-secondary" />
                    <h2 className="font-bold text-lg text-foreground">Historique des Distributions</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Date / Lot</th>
                            <th className="px-6 py-4">Article (Aliment)</th>
                            <th className="px-6 py-4 text-center">Quantité Distribuée</th>
                            <th className="px-6 py-4 text-center">Converti (Kg)</th>
                            <th className="px-6 py-4 text-center">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {(!data.data || data.data.length === 0) ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic">
                                    Aucune distribution d'aliment enregistrée.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((c) => (
                                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground text-base">
                                            {new Date(c.date).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                            Lot: {c.generation?.code}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-secondary font-medium">
                                            <Package className="w-4 h-4" />
                                            {c.category?.name || <span className="italic text-destructive">Catégorie inconnue</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-foreground">
                                        {c.quantity} <span className="text-muted-foreground font-medium text-xs ml-1">{c.unit?.symbol}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-accent/10 text-accent-foreground px-2.5 py-1 rounded font-mono text-xs font-bold border border-accent/20">
                                            {c.total_base_quantity > 0 ? `${c.total_base_quantity} kg` : '--'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                                c.status === 'approved' 
                                                ? 'bg-primary/10 text-primary border-primary/20' 
                                                : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                                            }`}>
                                                {c.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {c.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {c.status === 'draft' && (
                                            <button
                                                onClick={() => handleApprove(c.id)}
                                                disabled={processing}
                                                className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                                                title="Approuver et déduire du stock"
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
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    Stethoscope, 
    CheckCircle2, 
    Clock, 
    Check,
    Pill,
    UserCheck
} from 'lucide-react';
import { healthTreatmentsCreate, healthTreatmentsApprove } from '@/routes';

interface Treatment {
    id: number;
    date: string;
    disease_description: string;
    medication_name: string;
    dosage_description: string;
    veterinarian_name: string | null;
    status: 'draft' | 'approved';
    generation: {
        code: string;
        type: string;
    };
}

interface Props {
    data: {
        data: Treatment[];
    };
}

export default function HealthTreatmentIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Santé & Traitements', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Voulez-vous valider ce traitement ? cela confirmera l\'intervention médicale.')) {
            post(healthTreatmentsApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Santé" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={healthTreatmentsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau Traitement
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Date / Lot</th>
                            <th className="px-6 py-4">Pathologie</th>
                            <th className="px-6 py-4">Médicament & Dosage</th>
                            <th className="px-6 py-4">Vétérinaire</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.map((t) => (
                            <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-foreground">
                                        {new Date(t.date).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                        Lot: {t.generation.code}
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <div className="flex items-start gap-2">
                                        <Stethoscope className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                                        <p className="line-clamp-2 leading-relaxed">{t.disease_description}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 font-medium text-foreground">
                                        <Pill className="w-4 h-4 text-accent" />
                                        {t.medication_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground ml-6">
                                        {t.dosage_description}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {t.veterinarian_name ? (
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <UserCheck className="w-3.5 h-3.5" />
                                            {t.veterinarian_name}
                                        </div>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                        t.status === 'approved' 
                                        ? 'bg-primary/10 text-primary border-primary/20' 
                                        : 'bg-secondary/10 text-secondary border-secondary/20'
                                    }`}>
                                        {t.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {t.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {t.status === 'draft' && (
                                        <button
                                            onClick={() => handleApprove(t.id)}
                                            disabled={processing}
                                            className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
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
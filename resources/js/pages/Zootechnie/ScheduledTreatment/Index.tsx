import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    CalendarCheck, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    ShieldPlus,
    XCircle,
    Filter
} from 'lucide-react';
import { scheduledTreatmentsIndex, scheduledTreatmentsMarkAsDone } from '@/routes';

interface ScheduledTreatment {
    id: number;
    scheduled_date: string;
    status: 'pending' | 'completed' | 'missed';
    generation: {
        id: number;
        code: string;
        type: string;
    };
    step: {
        description: string;
        alert_days_before: number;
        medicationCategory?: {
            name: string;
        };
    };
}

interface Generation {
    id: number;
    code: string;
    type: string;
}

interface Props {
    treatments: {
        data: ScheduledTreatment[];
        links: any[]; // Pour la pagination d'Inertia
    };
    filters?: {
        generation_id?: string;
    };
    generations?: Generation[]; // La variable que Jules doit ajouter
}

export default function ScheduledTreatmentIndex({ treatments, filters, generations = [] }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Zootechnie', href: '#' },
        { title: 'Calendrier Sanitaire', href: '#' },
    ];

    // Marquer comme fait (Appel de la route définie dans web.php)
    const handleMarkAsDone = (id: number) => {
        if (confirm('Confirmer l\'administration de ce traitement préventif ?')) {
            // Utilisation du helper route() de Ziggy
            post(scheduledTreatmentsMarkAsDone.url(id));
        }
    };

    // Gestion du filtre interactif
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const generationId = e.target.value;
        router.get(scheduledTreatmentsIndex.url(), 
            { generation_id: generationId }, 
            { preserveState: true, preserveScroll: true }
        );
    };

    // Calcul d'imminence pour les alertes visuelles
    const isApproaching = (dateString: string, alertDays: number) => {
        const scheduledDate = new Date(dateString);
        const today = new Date();
        const diffTime = scheduledDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= alertDays;
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Prophylaxie" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                
                {/* Le Filtre par Lot */}
                <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border shadow-sm text-sm">
                    <Filter className="w-4 h-4 text-muted-foreground ml-1" />
                    <span className="font-bold uppercase text-muted-foreground text-xs">Filtrer :</span>
                    <select
                        value={filters?.generation_id || ''}
                        onChange={handleFilterChange}
                        className="bg-background border-none font-bold focus:ring-0 cursor-pointer outline-none text-primary"
                    >
                        <option value="">Tous les lots</option>
                        {generations.map(gen => (
                            <option key={gen.id} value={gen.id}>{gen.code} ({gen.type})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldPlus className="w-5 h-5 text-primary" />
                        <h2 className="font-bold text-lg text-foreground">Programme Sanitaire des Lots</h2>
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Date Prévue</th>
                            <th className="px-6 py-4">Génération (Lot)</th>
                            <th className="px-6 py-4">Intervention Prévue</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {treatments.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <ShieldPlus className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                                    <p className="text-muted-foreground font-medium">Aucun traitement programmé.</p>
                                    <p className="text-xs text-muted-foreground mt-1">Les traitements se génèrent automatiquement à la création d'un lot.</p>
                                </td>
                            </tr>
                        ) : (
                            treatments.data.map((treatment) => {
                                const approaching = treatment.status === 'pending' && isApproaching(treatment.scheduled_date, treatment.step.alert_days_before);
                                
                                return (
                                    <tr key={treatment.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className={`font-bold ${treatment.status === 'missed' ? 'text-destructive' : 'text-foreground'}`}>
                                                {new Date(treatment.scheduled_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                                            </div>
                                            {approaching && (
                                                <span className="text-[10px] text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded font-black uppercase flex items-center w-fit gap-1 mt-1 border border-orange-500/20">
                                                    <AlertCircle className="w-3 h-3" /> Imminent
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground">{treatment.generation.code}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">{treatment.generation.type}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-secondary-foreground">{treatment.step.description}</p>
                                            {treatment.step.medicationCategory && (
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    Catégorie : {treatment.step.medicationCategory.name}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Badges de statut */}
                                            {treatment.status === 'completed' && (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 bg-primary/10 text-primary border border-primary/20">
                                                    <CheckCircle2 className="w-3 h-3" /> TERMINÉ
                                                </span>
                                            )}
                                            {treatment.status === 'pending' && (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 bg-orange-500/10 text-orange-600 border border-orange-500/20">
                                                    <Clock className="w-3 h-3" /> EN ATTENTE
                                                </span>
                                            )}
                                            {treatment.status === 'missed' && (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 bg-destructive/10 text-destructive border border-destructive/20">
                                                    <XCircle className="w-3 h-3" /> MANQUÉ
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {treatment.status === 'pending' && (
                                                <button
                                                    onClick={() => handleMarkAsDone(treatment.id)}
                                                    disabled={processing}
                                                    className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition shadow-sm disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                                                    title="Marquer comme administré"
                                                >
                                                    <CalendarCheck className="w-4 h-4" />
                                                    Valider
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
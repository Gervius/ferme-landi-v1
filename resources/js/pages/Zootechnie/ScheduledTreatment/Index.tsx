// pages/Zootechnie/ScheduledTreatment/Index.tsx
import React, { useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import { CalendarCheck, CheckCircle2, Clock, AlertCircle, Syringe, Filter, XCircle } from 'lucide-react';
import { scheduledTreatmentsIndex, scheduledTreatmentsMarkAsDone } from '@/routes';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';
import { PaginatedData } from '@/types/pagination';

interface ScheduledTreatment {
    id: number;
    scheduled_date: string;
    status: 'pending' | 'completed';
    generation: { id: number; code: string; type: string };
    step: {
        description: string;
        day_offset: number;
        medicationCategory: { name: string };
    };
}

interface Props {
    treatments: PaginatedData<ScheduledTreatment>;
    filters: { generation_id?: string };
    generations: { id: number; code: string; type: string }[];
}

export default function Index({ treatments, filters, generations }: Props) {
    
    // Filtrage dynamique au changement de lot
    const handleFilterChange = (generationId: string) => {
        router.get(
            scheduledTreatmentsIndex.url(),
            { generation_id: generationId || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Action pour valider un soin
    const handleMarkAsDone = (id: number) => {
        if (confirm("Confirmez-vous que ce traitement a bien été administré au lot ?")) {
            router.post(scheduledTreatmentsMarkAsDone.url(id), {}, { preserveScroll: true });
        }
    };

    // Fonction utilitaire pour déterminer le statut temporel (En retard, Aujourd'hui, À venir)
    const getTimingStatus = (dateString: string, status: string) => {
        if (status === 'completed') return { label: 'Terminé', color: 'text-muted-foreground', bg: 'bg-muted', icon: CheckCircle2 };
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduledDate = new Date(dateString);
        scheduledDate.setHours(0, 0, 0, 0);

        const diffTime = scheduledDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { label: `${Math.abs(diffDays)}j de retard`, color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', icon: AlertCircle };
        if (diffDays === 0) return { label: "Aujourd'hui", color: 'text-primary', bg: 'bg-primary/10 border-primary/20', icon: Clock };
        if (diffDays === 1) return { label: "Demain", color: 'text-secondary', bg: 'bg-secondary/10 border-border', icon: Clock };
        
        return { label: `Dans ${diffDays}j`, color: 'text-foreground', bg: 'bg-card border-border', icon: Clock };
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 bg-background">
            
            {/* Header & Filtres */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <CalendarCheck className="text-primary" /> Calendrier Sanitaire
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Suivez et validez les interventions préventives générées par vos programmes de prophylaxie.
                    </p>
                </div>

                {/* Filtre par Lot */}
                <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-xl shadow-sm">
                    <Filter size={16} className="text-muted-foreground ml-2" />
                    <select
                        value={filters.generation_id || ''}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium focus:ring-0 text-foreground pr-8 cursor-pointer"
                    >
                        <option value="">Tous les lots actifs</option>
                        {generations.map(gen => (
                            <option key={gen.id} value={gen.id}>{gen.code}</option>
                        ))}
                    </select>
                    {filters.generation_id && (
                        <button onClick={() => handleFilterChange('')} className="p-1 hover:text-destructive transition-colors text-muted-foreground">
                            <XCircle size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Liste des Tâches (Timeline) */}
            <div className="space-y-4">
                {treatments.data.length > 0 ? (
                    treatments.data.map((treatment) => {
                        const { Icon: GenIcon, colorClass: genColor } = getGenerationDisplay(treatment.generation.type);
                        const timing = getTimingStatus(treatment.scheduled_date, treatment.status);

                        return (
                            <div 
                                key={treatment.id} 
                                className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all ${
                                    treatment.status === 'completed' ? 'bg-muted/30 border-border opacity-70' : `bg-card shadow-sm hover:shadow-md ${timing.bg}`
                                }`}
                            >
                                {/* Info principale */}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full mt-1 ${treatment.status === 'completed' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                                        <Syringe size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <timing.icon size={16} className={timing.color} />
                                            <span className={`text-sm font-bold ${timing.color}`}>
                                                {timing.label} • {new Date(treatment.scheduled_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className={`text-lg font-bold ${treatment.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                            {treatment.step.medicationCategory?.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            {treatment.step.description || "Aucune description fournie"}
                                        </p>
                                        
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-xs font-bold text-card-foreground">
                                                <GenIcon size={12} className={genColor} />
                                                Lot {treatment.generation.code}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                (Prévu à J+{treatment.step.day_offset})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="mt-4 md:mt-0 flex justify-end shrink-0">
                                    {treatment.status === 'pending' ? (
                                        <button
                                            onClick={() => handleMarkAsDone(treatment.id)}
                                            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
                                        >
                                            <CheckCircle2 size={18} />
                                            Marquer comme fait
                                        </button>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                                            <CheckCircle2 size={16} /> Fait
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-card border border-border border-dashed rounded-xl">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <CalendarCheck className="text-muted-foreground opacity-50" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Aucun traitement prévu</h3>
                        <p className="text-muted-foreground mt-2 max-w-md text-center">
                            Il n'y a aucune intervention sanitaire planifiée pour le moment.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination simple (Remplacement du DataTable) */}
            {treatments.last_page > 1 && (
                <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                    <span className="text-sm text-muted-foreground">
                        Affichage de {treatments.from} à {treatments.to} sur {treatments.total} tâches
                    </span>
                    <div className="flex gap-1">
                        {treatments.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    !link.url ? 'opacity-50 cursor-not-allowed text-muted-foreground' :
                                    link.active ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
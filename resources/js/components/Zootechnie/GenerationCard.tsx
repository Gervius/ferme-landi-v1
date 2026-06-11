
import React, { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { CalendarDays, MapPin, Activity, Settings2 } from 'lucide-react';
import { getGenerationDisplay } from '@/utils/zootechnieStrategy';
import { generationsEdit } from '@/routes';

interface Generation {
    id: number;
    code: string;
    type: string;
    status: string;
    initial_quantity: number;
    current_quantity?: number; // Optionnel à la création
    start_date: string;
    site: { name: string };
    breed: { name: string };
}

export function GenerationCard({ generation }: { generation: Generation }) {
    const { label, Icon, colorClass } = getGenerationDisplay(generation.type);
    
    // Calculs défensifs locaux
    const currentQty = generation.current_quantity ?? generation.initial_quantity;
    const survivalRate = Math.max(0, Math.min(100, (currentQty / generation.initial_quantity) * 100));
    
    const ageInDays = useMemo(() => {
        const start = new Date(generation.start_date).getTime();
        const now = new Date().getTime();
        return Math.floor((now - start) / (1000 * 60 * 60 * 24));
    }, [generation.start_date]);
    
    // Couleur de la jauge
    const progressColor = survivalRate > 95 ? 'bg-primary' : survivalRate > 85 ? 'bg-accent' : 'bg-destructive';

    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden flex flex-col h-full">
            {/* Liseré de couleur */}
            <div className={`absolute top-0 left-0 w-1.5 h-full ${colorClass.replace('text-', 'bg-')}`} />

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${colorClass}`}>
                        <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground leading-tight">{generation.code}</h3>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                            {label} • {generation.breed.name}
                        </p>
                    </div>
                </div>
                
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                    generation.status === 'actif' 
                        ? 'border-primary/20 bg-primary/10 text-primary' 
                        : 'border-muted bg-muted text-muted-foreground'
                }`}>
                    {generation.status.toUpperCase()}
                </span>
            </div>

            <div className="space-y-3 mb-6 flex-grow">
                <div className="flex items-center gap-2 text-sm text-card-foreground">
                    <MapPin size={16} className="text-muted-foreground shrink-0" />
                    <span className="truncate">{generation.site.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-card-foreground">
                    <CalendarDays size={16} className="text-muted-foreground shrink-0" />
                    <span>Démarré le {new Date(generation.start_date).toLocaleDateString()}</span>
                    <span className="text-muted-foreground text-xs font-medium bg-muted px-1.5 py-0.5 rounded ml-auto">
                        {ageInDays} jrs
                    </span>
                </div>
            </div>

            {/* Jauge de survie */}
            <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-card-foreground font-medium">
                        <Activity size={14} className="text-muted-foreground" /> 
                        Effectif
                    </span>
                    <span className="font-bold text-foreground">
                        {currentQty} <span className="text-muted-foreground text-xs font-normal">/ {generation.initial_quantity}</span>
                    </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${progressColor} transition-all duration-1000 ease-out`} 
                        style={{ width: `${survivalRate}%` }}
                    />
                </div>
            </div>

            <div className="pt-4 mt-5 border-t border-border flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <Link 
                    href={generationsEdit.url(generation.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                    <Settings2 size={16} />
                    Gérer le lot
                </Link>
            </div>
        </div>
    );
}
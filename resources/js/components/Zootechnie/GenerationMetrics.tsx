// components/Zootechnie/GenerationMetrics.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Egg, Skull, Utensils } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { metricsGetMetrics } from '@/routes';

interface DailyMetric {
    date: string;
    live_quantity: number;
    eggs_produced: number;
    feed_consumed: number;
    mortality_count: number;
    laying_rate: number;
    feed_conversion_ratio: number;
    average_weight: number;
}

interface Props {
    generationId: number;
    generationType: string; // 'pondeuse', 'chair', 'porc'
}

export function GenerationMetrics({ generationId, generationType }: Props) {
    const [metrics, setMetrics] = useState<DailyMetric[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(metricsGetMetrics.url(generationId))
            .then(response => {
                setMetrics(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des métriques", error);
                setLoading(false);
            });
    }, [generationId]);

    if (loading) {
        return <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">Chargement des performances...</div>;
    }

    if (metrics.length === 0) {
        return <div className="h-64 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-border border-dashed">Pas assez de données pour générer les graphiques.</div>;
    }

    const isPondeuse = generationType === 'pondeuse';

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Activity className="text-primary" /> Performances du Lot
            </h2>

            <div className={`grid grid-cols-1 ${isPondeuse ? 'lg:grid-cols-2' : ''} gap-6`}>
                
                {/* Graphique 1 : Mortalité & Survie (Pour tous) */}
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Skull size={16} /> Évolution de la Survie
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line type="monotone" dataKey="live_quantity" name="Sujets Vivants" stroke="var(--primary)" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Graphique 2 : Taux de Ponte (Uniquement Pondeuses) */}
                {isPondeuse && (
                    <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Egg size={16} /> Taux de Ponte (%)
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={metrics}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                                    <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Line type="monotone" dataKey="laying_rate" name="Taux de ponte" stroke="var(--accent)" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Graphique 3 : Indice de Consommation */}
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm md:col-span-full">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Utensils size={16} /> Consommation d'Aliment (Volume vs Indice)
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} />
                                <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line yAxisId="left" type="monotone" dataKey="feed_consumed" name="Aliment Consommé" stroke="var(--secondary)" strokeWidth={3} dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="feed_conversion_ratio" name="Indice de Consommation" stroke="var(--destructive)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Activity, 
    Egg, 
    Utensils, 
    Skull, 
    TrendingUp,
    Scale
} from 'lucide-react';
import axios from 'axios';
// Importation fictive pour Recharts (à installer via `npm install recharts`)
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart 
} from 'recharts';

interface Generation {
    id: number;
    code: string;
    type: string;
}

interface DailyMetric {
    date: string;
    live_quantity: number;
    eggs_produced: number;
    feed_consumed: number;
    mortality_count: number;
    laying_rate: number;
    feed_conversion_ratio: number;
    average_weight: number | null;
}

interface Props {
    activeGenerations: Generation[];
}

export default function Dashboard({ activeGenerations }: Props) {
    const [selectedGenId, setSelectedGenId] = useState<number | string>(
        activeGenerations?.length > 0 ? activeGenerations[0].id : ''
    );
    const [metrics, setMetrics] = useState<DailyMetric[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const breadcrumbs = [
        { title: 'Exploitation', href: '#' },
        { title: 'Tableau de bord', href: '#' },
    ];

    // Récupération des données via l'API ZootechnieStatsController
    useEffect(() => {
        if (!selectedGenId) return;

        const fetchMetrics = async () => {
            setIsLoading(true);
            try {
                // Route générée par le contrôleur de Jules pour l'API
                const response = await axios.get(`/api/zootechnie/stats/${selectedGenId}`);
                setMetrics(response.data.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des statistiques", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, [selectedGenId]);

    const selectedGen = activeGenerations?.find(g => g.id === Number(selectedGenId));
    const latestMetric = metrics?.length > 0 ? metrics[metrics?.length - 1] : null;

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Tableau de Bord" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                
                {/* Sélecteur de Lot pour filtrer le Dashboard */}
                <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border shadow-sm">
                    <span className="text-xs font-bold uppercase text-muted-foreground ml-2">Analyser le lot :</span>
                    <select
                        value={selectedGenId}
                        onChange={(e) => setSelectedGenId(e.target.value)}
                        className="bg-background border-none text-sm font-bold focus:ring-0 cursor-pointer outline-none text-primary"
                    >
                        {activeGenerations?.map(gen => (
                            <option key={gen.id} value={gen.id}>{gen.code} ({gen.type})</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">
                    Chargement des données d'exploitation...
                </div>
            ) : metrics?.length === 0 ? (
                <div className="bg-card p-10 rounded-xl border border-border text-center">
                    <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">Aucune métrique calculée pour ce lot.</p>
                    <p className="text-xs mt-1">La commande nocturne de calcul n'est pas encore passée ou les données sont vides.</p>
                </div>
            ) : (
                <>
                    {/* KPIs : La vue d'ensemble du dernier jour */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase text-muted-foreground">Effectif Vivant</p>
                                    <p className="text-2xl font-black text-foreground mt-1">
                                        {latestMetric?.live_quantity.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Activity className="w-5 h-5" /></div>
                            </div>
                        </div>

                        {selectedGen?.type === 'pondeuse' && (
                            <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Taux de Ponte Actuel</p>
                                        <p className="text-2xl font-black text-primary mt-1">
                                            {latestMetric?.laying_rate}%
                                        </p>
                                    </div>
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Egg className="w-5 h-5" /></div>
                                </div>
                            </div>
                        )}

                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase text-muted-foreground">Indice Consommation (IC)</p>
                                    <p className="text-2xl font-black text-accent mt-1">
                                        {latestMetric?.feed_conversion_ratio}
                                    </p>
                                </div>
                                <div className="p-2 bg-accent/10 rounded-lg text-accent-foreground"><Utensils className="w-5 h-5" /></div>
                            </div>
                        </div>

                        {(selectedGen?.type === 'chair' || selectedGen?.type === 'porc') && (
                            <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-muted-foreground">Poids Moyen</p>
                                        <p className="text-2xl font-black text-secondary mt-1">
                                            {latestMetric?.average_weight ? `${latestMetric.average_weight} kg` : '-'}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><Scale className="w-5 h-5" /></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Graphiques Principaux */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Graphique 1 : Courbe de Ponte (Si Pondeuse) ou Croissance (Si Chair/Porc) */}
                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                            <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                {selectedGen?.type === 'pondeuse' ? 'Évolution du Taux de Ponte (%)' : 'Courbe de Croissance Poids (Kg)'}
                            </h3>
                            <div className="h-64 w-full text-xs">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={metrics}>
                                        <defs>
                                            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} />
                                        <YAxis />
                                        <Tooltip 
                                            labelFormatter={(str) => new Date(str).toLocaleDateString('fr-FR')}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey={selectedGen?.type === 'pondeuse' ? 'laying_rate' : 'average_weight'} 
                                            stroke="var(--primary)" 
                                            fillOpacity={1} 
                                            fill="url(#colorPrimary)" 
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Graphique 2 : Indice de Consommation (FCR) */}
                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                            <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-accent" />
                                Indice de Consommation (Aliment vs Production)
                            </h3>
                            <div className="h-64 w-full text-xs">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={metrics}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} />
                                        <YAxis domain={['auto', 'auto']} />
                                        <Tooltip 
                                            labelFormatter={(str) => new Date(str).toLocaleDateString('fr-FR')}
                                        />
                                        <Line type="monotone" dataKey="feed_conversion_ratio" stroke="#84cc16" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
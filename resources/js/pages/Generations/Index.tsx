// pages/Generations/Index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { Plus, Search, Layers, ChevronRight, ChevronLeft } from 'lucide-react';
import { generationsCreate, generationsIndex } from '@/routes';
import { generationStrategy } from '@/utils/zootechnieStrategy';
import { GenerationCard } from '@/components/Zootechnie/GenerationCard';

interface PageProps {
    generations: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    activeLotsCount: Record<string, number>;
    filters: {
        type?: string;
        search?: string;
        status?: string;
    };
}

export default function Index({ generations, activeLotsCount, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.type || 'all');
    const initialRender = useRef(true);

    // Synchronisation avec le backend (Debounce pour la recherche)
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(generationsIndex.url(), {
                type: activeTab === 'all' ? undefined : activeTab,
                search: search || undefined,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 300); // 300ms de délai pour éviter de spammer le serveur

        return () => clearTimeout(timeout);
    }, [search, activeTab]);

    const totalActive = Object.values(activeLotsCount).reduce((a, b) => a + b, 0);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-background">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Lots & Générations</h1>
                    <p className="text-muted-foreground mt-1">Gérez le cycle de vie de votre cheptel sur tous les sites.</p>
                </div>
                <Link 
                    href={generationsCreate.url()} 
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-sm"
                >
                    <Plus size={18} />
                    Nouveau Lot
                </Link>
            </div>

            {/* Barre de Filtres & Navigation */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card p-2 border border-border rounded-xl shadow-sm">
                
                {/* Onglets */}
                <div className="flex w-full lg:w-auto overflow-x-auto scrollbar-hide gap-1">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                            activeTab === 'all' ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                        <Layers size={16} />
                        Tous
                        {totalActive > 0 && (
                            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-background/20 text-xs">{totalActive}</span>
                        )}
                    </button>
                    
                    {Object.entries(generationStrategy).map(([key, config]) => {
                        const count = activeLotsCount[key] || 0;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                                    activeTab === key ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <config.Icon size={16} />
                                {config.label}
                                {count > 0 && (
                                    <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === key ? 'bg-background/20' : 'bg-muted-foreground/20 text-foreground'}`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Recherche */}
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-ring focus:border-ring text-sm transition-shadow placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Grille des Lots */}
            {generations.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {generations.data.map(generation => (
                            <GenerationCard key={generation.id} generation={generation} />
                        ))}
                    </div>

                    {/* Pagination simplifiée (Optionnelle selon ce que retourne Inertia) */}
                    {generations.last_page > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-6">
                            <span className="text-sm text-muted-foreground">
                                Page {generations.current_page} sur {generations.last_page}
                            </span>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-card border border-border border-dashed rounded-xl">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Layers className="text-muted-foreground opacity-50" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Aucun lot trouvé</h3>
                    <p className="text-muted-foreground mt-2 max-w-md text-center">
                        Essayez de modifier vos filtres ou créez une nouvelle génération pour ce site.
                    </p>
                </div>
            )}
        </div>
    );
}
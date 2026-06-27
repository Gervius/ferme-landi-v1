import React, { useState, useEffect, useRef } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Plus, Search, Layers } from 'lucide-react';
import { getGenerationDisplay, generationStrategy } from '@/utils/zootechnieStrategy';
import { GenerationCard } from '@/components/Zootechnie/GenerationCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface PageProps {
    generations: {
        data: any[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    activeLotsCount: Record<string, number>;
    filters: any;
    sites: { id: number; name: string }[];
    breeds: { id: number; name: string }[];
}

export default function Index({ generations, activeLotsCount, filters, sites, breeds }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.type || 'all');
    const initialRender = useRef(true);

    // --- ÉTAT DES MODALES ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // --- FORMULAIRE INERTIA UNIFIÉ ---
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        site_id: '',
        breed_id: '',
        type: 'pondeuse',
        start_date: new Date().toISOString().split('T')[0],
        initial_quantity: 0,
        current_quantity: 0,
        status: 'actif',
        observation: '',
    });

    const strategy = getGenerationDisplay(data.type);

    // --- SYNCHRONISATION DES FILTRES (URI EN DUR) ---
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get('/zootechnie/generations', {
                type: activeTab === 'all' ? undefined : activeTab,
                search: search || undefined,
            }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);
        
        return () => clearTimeout(timeout);
    }, [search, activeTab]);

    // Ouvre le modal en mode Création
    const openCreateModal = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Ouvre le modal en mode Édition
    const openEditModal = (gen: any) => {
        setEditingId(gen.id);
        clearErrors();
        setData({
            site_id: gen.site_id,
            breed_id: gen.breed_id,
            type: gen.type,
            start_date: gen.start_date.split('T')[0],
            initial_quantity: gen.initial_quantity,
            current_quantity: gen.current_quantity,
            status: gen.status,
            observation: gen.observation || '',
        });
        setIsModalOpen(true);
    };

    // --- SOUMISSION DU FORMULAIRE (URI EN DUR) ---
    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        };

        if (editingId) {
            put(`/zootechnie/generations/${editingId}`, options);
        } else {
            post('/zootechnie/generations', options);
        }
    };

    const hasData = generations?.data && generations.data.length > 0;
    const totalActive = activeLotsCount ? Object.values(activeLotsCount).reduce((a, b) => a + b, 0) : 0;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-background min-h-screen text-foreground">
            {/* --- EN-TÊTE --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Lots & Générations</h1>
                    <p className="text-muted-foreground mt-1">Gérez le cycle de vie de votre cheptel.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-sm"
                >
                    <Plus size={18} />
                    Nouveau Lot
                </button>
            </div>

            {/* --- FILTRES DE RECHERCHE & ONGLETS --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card p-2 border border-border rounded-xl shadow-sm">
                
                {/* Onglets Stratégiques */}
                <div className="flex w-full lg:w-auto overflow-x-auto scrollbar-hide gap-1">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                            activeTab === 'all' ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                        <Layers size={16} /> Tous
                        {totalActive > 0 && <span className="ml-1.5 px-2 py-0.5 rounded-full bg-background/50 text-xs">{totalActive}</span>}
                    </button>
                    
                    {activeLotsCount && Object.entries(generationStrategy).map(([key, config]) => {
                        const count = activeLotsCount[key] || 0;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                                    activeTab === key ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <config.Icon size={16} /> {config.label}
                                {count > 0 && <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === key ? 'bg-background/50' : 'bg-muted-foreground/20 text-foreground'}`}>{count}</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Recherche */}
                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                        type="text" 
                        placeholder="Rechercher un code (ex: PP-2026)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-input border border-border text-foreground rounded-lg focus:ring-ring focus:outline-none focus:ring-2 text-sm transition-shadow placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* --- GRILLE / LISTE --- */}
            {hasData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {generations.data.map((generation: any) => (
                        <GenerationCard 
                            key={generation.id} 
                            generation={generation} 
                            onEdit={() => openEditModal(generation)}
                        />
                    ))}
                </div>
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

            {/* --- MODAL UNIFIÉ (Création & Édition) --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <strategy.Icon className={strategy.colorClass} size={24} />
                            {editingId ? 'Mettre à jour le Lot' : 'Déclarer un nouveau Lot'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingId ? 'Ajustez les effectifs ou clôturez ce lot (les informations génétiques sont verrouillées).' : 'Initialisez une nouvelle génération sur un site.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitForm} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Site */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Site d'élevage</label>
                                <select 
                                    disabled={!!editingId}
                                    value={data.site_id} 
                                    onChange={e => setData('site_id', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm disabled:opacity-50"
                                >
                                    <option value="">Sélectionnez un site</option>
                                    {sites?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                {errors.site_id && <span className="text-destructive text-xs">{errors.site_id}</span>}
                            </div>

                            {/* Race */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Race</label>
                                <select 
                                    disabled={!!editingId}
                                    value={data.breed_id} 
                                    onChange={e => setData('breed_id', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm disabled:opacity-50"
                                >
                                    <option value="">Sélectionnez une race</option>
                                    {breeds?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                {errors.breed_id && <span className="text-destructive text-xs">{errors.breed_id}</span>}
                            </div>
                            
                            {/* Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Type de production</label>
                                <select 
                                    disabled={!!editingId}
                                    value={data.type} 
                                    onChange={e => setData('type', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm disabled:opacity-50"
                                >
                                    <option value="pondeuse">Pondeuse</option>
                                    <option value="chair">Poulet de chair</option>
                                    <option value="porc">Porcin</option>
                                </select>
                            </div>

                            {/* Date de démarrage */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Date de démarrage</label>
                                <input 
                                    disabled={!!editingId} 
                                    type="date" 
                                    value={data.start_date} 
                                    onChange={e => setData('start_date', e.target.value)} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm disabled:opacity-50"
                                />
                            </div>

                            {/* Quantité Initiale */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Quantité {editingId ? 'Initiale' : ''}</label>
                                <input 
                                    disabled={!!editingId} 
                                    type="number" 
                                    value={data.initial_quantity} 
                                    onChange={e => setData('initial_quantity', Number(e.target.value))} 
                                    className="w-full bg-input border border-border rounded-md p-2 text-sm disabled:opacity-50"
                                />
                                {errors.initial_quantity && <span className="text-destructive text-xs">{errors.initial_quantity}</span>}
                            </div>

                            {/* Champs spécifiques à l'Édition (Mise à jour) */}
                            {editingId && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-primary">Effectif Actuel</label>
                                        <input 
                                            type="number" 
                                            value={data.current_quantity} 
                                            onChange={e => setData('current_quantity', Number(e.target.value))} 
                                            className="w-full bg-input border-primary/50 rounded-md p-2 text-sm focus:ring-primary/50"
                                        />
                                        {errors.current_quantity && <span className="text-destructive text-xs">{errors.current_quantity}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Statut du lot</label>
                                        <select 
                                            value={data.status} 
                                            onChange={e => setData('status', e.target.value)} 
                                            className="w-full bg-input border border-border rounded-md p-2 text-sm"
                                        >
                                            <option value="actif">Actif</option>
                                            <option value="cloture">Clôturé (Vendu/Réformé)</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Observations */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Observations</label>
                            <textarea 
                                value={data.observation} 
                                onChange={e => setData('observation', e.target.value)} 
                                className="w-full bg-input border border-border rounded-md p-2 text-sm min-h-[80px] resize-none"
                                placeholder="Notes éventuelles..."
                            />
                        </div>

                        {/* Actions du Modal */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md transition"
                            >
                                Annuler
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md font-medium disabled:opacity-50 transition flex items-center gap-2"
                            >
                                {editingId ? 'Mettre à jour le lot' : 'Enregistrer le lot'}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
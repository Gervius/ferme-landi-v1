import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
// Adapte selon ton routeur métier (ex: @/routes)
import { categoriesCreate, categoriesDestroy, categoriesEdit, categoriesIndex } from '@/routes';

// 1. Interfaces TypeScript
interface Category {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    scope: string;
    is_active: boolean;
    parent: Category | null; // Chargé par le 'with' du contrôleur
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    categories: {
        data: Category[];
        links: PaginationLink[];
    };
    filters: {
        scope?: string;
    };
    flash?: {
        success?: string;
    };
}

export default function CategoryIndex({ categories, filters, flash = {} }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Toutes les sous-catégories pourraient être affectées.')) {
            // Utilise ton helper ou router.delete(`/categories/${id}`)
            destroy(categoriesDestroy.url(id));
        }
    };

    // Filtrage dynamique appelant le contrôleur de Jules
    const handleScopeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const scope = e.target.value;
        router.get(
            categoriesIndex.url(), // Ou categoriesIndex.url()
            { scope: scope || undefined },
            { preserveState: true, replace: true }
        );
    };

    // Traduction esthétique des scopes métier
    const formatScope = (scope: string) => {
        const scopes: Record<string, { label: string; color: string }> = {
            inventory: { label: 'Inventaire & Stock', color: 'bg-primary/10 text-primary border-primary/20' },
            animal: { label: 'Zootechnie (Animaux)', color: 'bg-accent/20 text-accent-foreground border-accent/30' },
            finance: { label: 'Finance & Compta', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
            equipment: { label: 'Équipement', color: 'bg-secondary/10 text-secondary border-secondary/20' },
        };
        return scopes[scope] || { label: scope, color: 'bg-muted text-muted-foreground' };
    };

    return (
        <div className="p-6 bg-background text-foreground min-h-screen font-sans">
            <Head title="Ferme-Landi | Catégories" />

            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Catégories & Nomenclatures</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Gestion hiérarchique des classifications de l'ERP.</p>
                    </div>
                    <Link
                        href={categoriesCreate.url()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-5 rounded-md shadow-sm transition flex items-center gap-2"
                    >
                        <span className="text-accent font-bold text-lg">+</span> Nouvelle Catégorie
                    </Link>
                </div>

                {/* Message Flash */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-primary/10 border-l-4 border-primary text-primary shadow-sm rounded-r-md flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {/* Barre de Filtres */}
                <div className="mb-6 flex items-center bg-card p-4 rounded-xl shadow-sm border border-border">
                    <label htmlFor="filter_scope" className="text-sm font-semibold mr-4 text-foreground">
                        Filtrer par domaine métier :
                    </label>
                    <select
                        id="filter_scope"
                        value={filters?.scope || ''}
                        onChange={handleScopeFilter}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                    >
                        <option value="">Tous les domaines</option>
                        <option value="inventory">Inventaire & Stock</option>
                        <option value="animal">Zootechnie (Animaux)</option>
                        <option value="finance">Finance & Compta</option>
                        <option value="equipment">Équipement</option>
                    </select>
                </div>

                {/* Tableau de données */}
                <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-primary text-primary-foreground">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nom (Hiérarchie)</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Identifiant (Slug)</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Domaine (Scope)</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground font-medium">
                                        Aucune catégorie ne correspond aux critères.
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map((category) => {
                                    const scopeData = formatScope(category.scope);
                                    return (
                                        <tr key={category.id} className="hover:bg-muted/50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {/* Affichage hiérarchique intuitif */}
                                                {category.parent ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">{category.parent.name}</span>
                                                        <span className="text-muted-foreground text-xs">▶</span>
                                                        <span className="font-bold">{category.name}</span>
                                                    </span>
                                                ) : (
                                                    <span className="font-bold">{category.name}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                {category.slug}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-md border ${scopeData.color}`}>
                                                    {scopeData.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs font-bold rounded-full border ${
                                                    category.is_active 
                                                    ? 'bg-primary/10 text-primary border-primary/20' 
                                                    : 'bg-destructive/10 text-destructive border-destructive/20'
                                                }`}>
                                                    {category.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={categoriesEdit.url(category.id)}
                                                    className="text-primary hover:text-primary/80 mr-4 transition"
                                                >
                                                    Modifier
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-destructive hover:text-destructive/80 transition"
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-end gap-1.5">
                    {categories.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-4 py-2 text-sm border rounded-lg shadow-sm transition ${
                                link.active 
                                ? 'bg-primary text-primary-foreground font-semibold border-primary' 
                                : 'bg-card text-foreground hover:bg-muted border-border'
                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
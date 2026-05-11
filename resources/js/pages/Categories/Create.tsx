import React, { useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { categoriesIndex } from '@/routes';

interface Category {
    id: number;
    name: string;
    scope: string;
}

interface Props {
    parents: Category[];
}

export default function CategoryCreate({ parents }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        scope: '',
        parent_id: '',
        is_active: true,
    });

    // Filtre les parents en fonction du scope sélectionné pour éviter les erreurs de hiérarchie
    const filteredParents = useMemo(() => {
        if (!data.scope) return [];
        return parents.filter(p => p.scope === data.scope);
    }, [data.scope, parents]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/categories');
    };

    return (
        <div className="p-6 bg-background text-foreground min-h-screen font-sans">
            <Head title="Nouvelle Catégorie | Ferme-Landi" />

            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Nouvelle Catégorie</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Définir une classification pour les stocks, les animaux ou les finances.
                        </p>
                    </div>
                    <Link
                        href={categoriesIndex.url()}
                        className="bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium py-2 px-4 rounded-md transition border border-secondary/20"
                    >
                        ← Retour
                    </Link>
                </div>

                <div className="bg-card text-card-foreground shadow-lg rounded-xl border border-border p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Domaine Métier (Scope) */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="scope" className="block text-sm font-semibold mb-2">
                                    Domaine d'utilisation (Scope) <span className="text-destructive">*</span>
                                </label>
                                <select
                                    id="scope"
                                    value={data.scope}
                                    onChange={(e) => setData('scope', e.target.value)}
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none ${
                                        errors.scope ? 'border-destructive' : 'border-input'
                                    }`}
                                >
                                    <option value="">Sélectionnez un domaine...</option>
                                    <option value="inventory">Inventaire & Stocks</option>
                                    <option value="animal">Zootechnie (Suivi Sujets)</option>
                                    <option value="finance">Finance & Comptabilité</option>
                                    <option value="equipment">Équipement & Matériel</option>
                                </select>
                                {errors.scope && <p className="text-destructive text-sm mt-1">{errors.scope}</p>}
                            </div>

                            {/* Nom de la catégorie */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                                    Nom de la catégorie <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ex: Aliments de démarrage"
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none ${
                                        errors.name ? 'border-destructive' : 'border-input'
                                    }`}
                                />
                                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Catégorie Parente */}
                            <div>
                                <label htmlFor="parent_id" className="block text-sm font-semibold mb-2">
                                    Catégorie Parente (Optionnel)
                                </label>
                                <select
                                    id="parent_id"
                                    value={data.parent_id}
                                    disabled={!data.scope}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
                                >
                                    <option value="">Aucune (Catégorie Racine)</option>
                                    {filteredParents.map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.name}
                                        </option>
                                    ))}
                                </select>
                                {!data.scope && <p className="text-xs text-muted-foreground mt-1 italic text-accent">Choisissez d'abord un domaine.</p>}
                            </div>

                            {/* Slug (Optionnel - Informatique) */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="slug" className="block text-sm font-semibold mb-2 text-muted-foreground">
                                    Identifiant unique (Slug - Optionnel)
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="laisser-vide-pour-auto-generation"
                                    className="w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                />
                                {errors.slug && <p className="text-destructive text-sm mt-1">{errors.slug}</p>}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                            <Link
                                href={categoriesIndex.url()}
                                className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-md shadow-sm transition flex items-center gap-2 disabled:opacity-70"
                            >
                                {processing ? 'Création...' : 'Créer la catégorie'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
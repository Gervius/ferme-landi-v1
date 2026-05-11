import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { categoriesIndex, categoriesUpdate } from '@/routes';

interface Category {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    scope: string;
    is_active: boolean;
}

interface Props {
    category: Category;
    parents: Category[];
}

export default function CategoryEdit({ category, parents }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        scope: category.scope,
        parent_id: category.parent_id || '',
        is_active: category.is_active,
    });

    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();
        put(categoriesUpdate.url(category.id));
    };

    return (
        <div className="p-6 bg-background text-foreground min-h-screen font-sans">
            <Head title={`Modifier ${category.name} | Ferme-Landi`} />

            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <h1 className="text-3xl font-bold tracking-tight">Modifier la Catégorie</h1>
                    <Link href={categoriesIndex.url()} className="bg-secondary/10 text-secondary py-2 px-4 rounded-md border border-secondary/20">
                        ← Retour
                    </Link>
                </div>

                <div className="bg-card text-card-foreground shadow-lg rounded-xl border border-border p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold mb-2">Domaine (Scope)</label>
                                <select value={data.scope} onChange={e => setData('scope', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
                                    <option value="inventory">Inventaire & Stocks</option>
                                    <option value="animal">Zootechnie</option>
                                    <option value="finance">Finance & Compta</option>
                                    <option value="equipment">Équipement</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Nom</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Parent</label>
                                <select value={data.parent_id} onChange={e => setData('parent_id', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
                                    <option value="">Aucun (Racine)</option>
                                    {parents.filter(p => p.scope === data.scope).map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-border">
                            <button type="submit" disabled={processing} className="bg-primary text-primary-foreground font-semibold py-2.5 px-6 rounded-md shadow-sm">
                                {processing ? 'Mise à jour...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
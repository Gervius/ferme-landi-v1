import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { sitesIndex, sitesStore } from '@/routes';

// 1. Définition des Interfaces
interface Company {
    id: number;
    name: string;
}

interface Props {
    companies: Company[];
}

export default function SiteCreate({ companies }: Props) {
    // 2. Initialisation du formulaire avec Inertia
    const { data, setData, post, processing, errors } = useForm({
        company_id: '',
        name: '',
        code: '',
        type: '',
        address: '',
        is_active: true,
    });

    // 3. Soumission du formulaire
    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(sitesStore.url());
    };

    return (
        <div className="p-6 bg-background text-foreground min-h-screen font-sans">
            <Head title="Nouveau Site | Ferme-Landi" />

            <div className="max-w-3xl mx-auto">
                {/* En-tête avec bouton retour */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ajouter un Site</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Création d'une nouvelle infrastructure pour l'ERP Ferme-Landi.
                        </p>
                    </div>
                    <Link
                        href= {sitesIndex.url()} // Ou sitesIndex.url()
                        className="bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium py-2 px-4 rounded-md transition duration-150 border border-secondary/20"
                    >
                        ← Retour à la liste
                    </Link>
                </div>

                {/* Formulaire avec le style "Card" de notre app.css */}
                <div className="bg-card text-card-foreground shadow-lg rounded-xl border border-border p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Champ : Entreprise */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="company_id" className="block text-sm font-semibold mb-2">
                                    Entreprise de rattachement <span className="text-destructive">*</span>
                                </label>
                                <select
                                    id="company_id"
                                    value={data.company_id}
                                    onChange={(e) => setData('company_id', e.target.value)}
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.company_id ? 'border-destructive focus:ring-destructive' : 'border-input'
                                    }`}
                                >
                                    <option value="">Sélectionnez une entreprise...</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.company_id && <p className="text-destructive text-sm mt-1">{errors.company_id}</p>}
                            </div>

                            {/* Champ : Nom du Site */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                                    Nom du Site <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ex: KIRI 1-PONDEUSE"
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.name ? 'border-destructive focus:ring-destructive' : 'border-input'
                                    }`}
                                />
                                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Champ : Code (Optionnel) */}
                            <div>
                                <label htmlFor="code" className="block text-sm font-semibold mb-2">
                                    Code du Site
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="Laisser vide pour auto-génération"
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.code ? 'border-destructive focus:ring-destructive' : 'border-input'
                                    }`}
                                />
                                {errors.code && <p className="text-destructive text-sm mt-1">{errors.code}</p>}
                                <p className="text-xs text-muted-foreground mt-1">L'action métier générera un code unique si ce champ est vide.</p>
                            </div>

                            {/* Champ : Type */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="type" className="block text-sm font-semibold mb-2">
                                    Type d'exploitation <span className="text-destructive">*</span>
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.type ? 'border-destructive focus:ring-destructive' : 'border-input'
                                    }`}
                                >
                                    <option value="">Sélectionnez un type...</option>
                                    <option value="ferme_avicole">Ferme Avicole</option>
                                    <option value="ferme_porcine">Ferme Porcine</option>
                                    <option value="usine_transformation">Usine de Transformation</option>
                                    <option value="entrepot">Entrepôt</option>
                                    <option value="bureau">Bureau Administratif</option>
                                </select>
                                {errors.type && <p className="text-destructive text-sm mt-1">{errors.type}</p>}
                            </div>

                            {/* Champ : Adresse */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-semibold mb-2">
                                    Adresse géographique
                                </label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Localisation précise du site..."
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.address ? 'border-destructive focus:ring-destructive' : 'border-input'
                                    }`}
                                />
                                {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
                            </div>

                            {/* Champ : Statut (Actif/Inactif) */}
                            <div className="col-span-1 md:col-span-2 flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary bg-background"
                                />
                                <label htmlFor="is_active" className="ml-3 block text-sm font-semibold text-foreground">
                                    Le site est opérationnel (Actif)
                                </label>
                            </div>
                        </div>

                        {/* Actions du formulaire */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                            <Link
                                href={sitesIndex.url()}
                                className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-md shadow-sm transition duration-150 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Enregistrement...' : 'Enregistrer le site'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
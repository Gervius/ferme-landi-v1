import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { sitesCreate, sitesDestroy, sitesEdit } from '@/routes';

// 1. Définition des Interfaces TypeScript
interface Company {
    id: number;
    name: string;
}

interface Site {
    id: number;
    code: string;
    name: string;
    type: string;
    address: string | null;
    is_active: boolean;
    company: Company;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    sites: {
        data: Site[];
        links: PaginationLink[];
    };
    flash?: {
        success?: string;
    };
}

export default function SiteIndex({ sites, flash = {} }: Props) {
    const { delete: destroy } = useForm();

    // Fonction pour gérer la suppression avec confirmation
    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir désactiver ce site pour Ferme-Landi ?')) {
            destroy(sitesDestroy.url(id));
        }
    };

    // Fonction utilitaire pour le formatage du type de site
    const formatType = (type: string) => {
        return type.replace('_', ' ').toUpperCase();
    };

    return (
        <div className="p-6 bg-background text-foreground min-h-screen font-sans">
            <Head title="Ferme-Landi | Gestion des Sites" />

            <div className="max-w-7xl mx-auto">
                {/* En-tête de la page */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Sites d'Exploitation</h1>
                    <Link
                        href={sitesCreate.url()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-5 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center gap-2"
                    >
                        <span className="text-accent font-bold text-lg">+</span> Nouveau Site
                    </Link>
                </div>

                {/* Message Flash de succès */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-primary/10 border-l-4 border-primary text-primary shadow-sm rounded-r-md flex items-center gap-3">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {/* Tableau de données */}
                <div className="bg-card text-card-foreground shadow-lg rounded-xl overflow-hidden border border-border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-primary text-primary-foreground">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Code</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nom du Site</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Entreprise</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sites.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-medium">
                                        Aucun site n'a encore été référencé pour Ferme-Landi.
                                    </td>
                                </tr>
                            ) : (
                                sites.data.map((site) => (
                                    <tr key={site.id} className="hover:bg-muted/50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                            {site.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {site.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {/* Badge Type - Utilise Secondary */}
                                            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium border border-secondary/20">
                                                {formatType(site.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                            {site.company.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {/* Badge Statut - Primary pour actif, Destructive pour inactif */}
                                            <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${
                                                site.is_active 
                                                ? 'bg-primary/10 text-primary border-primary/20' 
                                                : 'bg-destructive/10 text-destructive border-destructive/20'
                                            }`}>
                                                {site.is_active ? 'ACTIF' : 'INACTIF'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={sitesEdit.url(site.id)}
                                                className="text-primary hover:text-primary/80 mr-5 transition"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(site.id)}
                                                className="text-destructive hover:text-destructive/80 transition"
                                            >
                                                Désactiver
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-end gap-1.5">
                    {sites.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-4 py-2 text-sm border rounded-lg shadow-sm transition duration-150 ${
                                link.active 
                                ? 'bg-primary text-primary-foreground font-semibold border-primary' 
                                : 'bg-card text-card-foreground hover:bg-muted border-border'
                            } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
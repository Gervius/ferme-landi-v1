import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { sitesCreate, sitesDestroy, sitesEdit } from '@/routes';

// 1. Définition des Interfaces TypeScript pour un code robuste
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
    flash: {
        success?: string;
    };
}

export default function SiteIndex({ sites, flash }: Props) {
    const { delete: destroy } = useForm();

    // Fonction pour gérer la suppression avec confirmation
    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir désactiver ce site ?')) {
            destroy(sitesDestroy.url(id));
        }
    };

    // Fonction utilitaire pour le formatage du type de site
    const formatType = (type: string) => {
        return type.replace('_', ' ').toUpperCase();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Head title="Gestion des Sites" />

            <div className="max-w-7xl mx-auto">
                {/* En-tête de la page */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Sites d'Exploitation</h1>
                    <Link
                        href={sitesCreate.url()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-150 ease-in-out"
                    >
                        + Nouveau Site
                    </Link>
                </div>

                {/* Message Flash de succès */}
                {flash.success && (
                    <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 shadow-sm">
                        {flash.success}
                    </div>
                )}

                {/* Tableau de données */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Nom du Site</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Entreprise</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-100 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sites.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        Aucun site n'a été trouvé.
                                    </td>
                                </tr>
                            ) : (
                                sites.data.map((site) => (
                                    <tr key={site.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {site.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {site.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                                                {formatType(site.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {site.company.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${site.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {site.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={sitesEdit.url(site.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(site.id)}
                                                className="text-red-600 hover:text-red-900"
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

                {/* Pagination Simple */}
                <div className="mt-4 flex justify-end">
                    {sites.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-3 py-1 mx-1 border rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
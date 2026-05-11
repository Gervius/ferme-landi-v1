import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
// Adapte tes imports de routes selon ton routeur
import { unitsCreate, unitsDestroy, unitsEdit } from '@/routes'; 

// 1. Définition des Interfaces
interface BaseUnit {
    id: number;
    name: string;
    symbol: string;
}

interface Unit {
    id: number;
    name: string;
    symbol: string;
    type: string;
    is_base_unit: boolean;
    base_unit_id: number | null;
    conversion_rate: string | number; // Souvent reçu en string depuis decimal
    is_active: boolean;
    base_unit: BaseUnit | null; // Relation chargée par Jules
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    units: {
        data: Unit[];
        links: PaginationLink[];
    };
    flash?: {
        success?: string;
    };
}

export default function UnitIndex({ units, flash = {} }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette unité ? Attention, cela peut impacter les stocks associés.')) {
            destroy(unitsDestroy.url(id));
        }
    };

    const formatType = (type: string) => {
        const types: Record<string, string> = {
            masse: 'Masse',
            volume: 'Volume',
            longueur: 'Longueur',
            unitaire: 'Unitaire',
            conditionnement: 'Conditionnement',
        };
        return types[type] || type;
    };

    // Fonction pour afficher joliment la règle de conversion
    const renderConversion = (unit: Unit) => {
        if (unit.is_base_unit) {
            return (
                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded text-xs font-semibold border border-primary/20">
                    Unité de base
                </span>
            );
        }
        
        if (unit.base_unit) {
            // Supprime les zéros inutiles de la décimale (ex: 30.000000 -> 30)
            const rate = parseFloat(unit.conversion_rate.toString());
            return (
                <span className="text-sm font-medium text-muted-foreground">
                    1 <span className="font-bold text-foreground">{unit.symbol}</span> = {rate} <span className="font-bold text-foreground">{unit.base_unit.symbol}</span>
                </span>
            );
        }

        return <span className="text-muted-foreground italic">-</span>;
    };

    return (
        <div className="p-6 bg-background text-foreground min-h-screen font-sans">
            <Head title="Ferme-Landi | Unités de Mesure" />

            <div className="max-w-7xl mx-auto">
                {/* En-tête de la page */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Unités de Mesure</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Gestion de la métrologie et des conditionnements.</p>
                    </div>
                    <Link
                        href={unitsCreate.url()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-5 rounded-md shadow-sm transition flex items-center gap-2"
                    >
                        <span className="text-accent font-bold text-lg">+</span> Nouvelle Unité
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

                {/* Tableau de données */}
                <div className="bg-card shadow-lg rounded-xl overflow-hidden border border-border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-primary text-primary-foreground">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Symbole</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Conversion</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {units.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground font-medium">
                                        Aucune unité n'a été paramétrée.
                                    </td>
                                </tr>
                            ) : (
                                units.data.map((unit) => (
                                    <tr key={unit.id} className="hover:bg-muted/50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-foreground">
                                            {unit.symbol}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {unit.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                                            {formatType(unit.type)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderConversion(unit)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs font-bold rounded-full border ${
                                                unit.is_active 
                                                ? 'bg-primary/10 text-primary border-primary/20' 
                                                : 'bg-destructive/10 text-destructive border-destructive/20'
                                            }`}>
                                                {unit.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={unitsEdit.url(unit.id)}
                                                className="text-primary hover:text-primary/80 mr-4 transition"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(unit.id)}
                                                className="text-destructive hover:text-destructive/80 transition"
                                            >
                                                Supprimer
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
                    {units.links.map((link, index) => (
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
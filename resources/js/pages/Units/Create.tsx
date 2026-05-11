import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
// Adapte l'import selon ton routeur
import { unitsIndex, unitsStore } from '@/routes'; 

interface BaseUnit {
    id: number;
    name: string;
    symbol: string;
}

interface Props {
    baseUnits: BaseUnit[];
}

export default function UnitCreate({ baseUnits }: Props) {
    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        symbol: '',
        type: '',
        is_base_unit: true,
        base_unit_id: '',
        conversion_rate: '',
        is_active: true,
    });


    transform((data) => ({
        ...data,
        base_unit_id: data.is_base_unit ? null : data.base_unit_id,
        conversion_rate: data.is_base_unit ? 1.0 : parseFloat(data.conversion_rate as string),
    }));


    // Effet React : Si on recoche "Unité de base", on vide automatiquement les champs enfants
    useEffect(() => {
        if (data.is_base_unit) {
            setData((prevData) => ({
                ...prevData,
                base_unit_id: '',
                conversion_rate: '',
            }));
        }
    }, [data.is_base_unit]);

    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();
        // Utilise l'URL de ton routeur, par exemple unitsStore.url() ou '/logistique/units'
        post(unitsStore.url(),{
            preserveScroll: true,
            onError: (err) => {
                console.error("🚨 Laravel a bloqué la soumission :", err);
                alert("Erreur de validation. Vérifiez la console (F12) pour les détails.");
            }
        });
    };

    return (
        <div className="p-6 bg-background text-foreground min-h-screen font-sans">
            <Head title="Nouvelle Unité | Ferme-Landi" />

            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ajouter une Unité</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Définir une nouvelle unité de mesure ou de conditionnement.
                        </p>
                    </div>
                    <Link
                        href={unitsIndex ? unitsIndex.url() : '/logistique/units'}
                        className="bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium py-2 px-4 rounded-md transition border border-secondary/20"
                    >
                        ← Retour à la liste
                    </Link>
                </div>

                <div className="bg-card text-card-foreground shadow-lg rounded-xl border border-border p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nom de l'unité */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                                    Nom complet <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ex: Plateau de 30 oeufs"
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.name ? 'border-destructive focus:ring-destructive' : 'border-input'
                                    }`}
                                />
                                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Symbole */}
                            <div>
                                <label htmlFor="symbol" className="block text-sm font-semibold mb-2">
                                    Symbole (Unique) <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="symbol"
                                    value={data.symbol}
                                    onChange={(e) => setData('symbol', e.target.value)}
                                    placeholder="Ex: PL30"
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.symbol ? 'border-destructive focus:ring-destructive' : 'border-input'
                                    }`}
                                />
                                {errors.symbol && <p className="text-destructive text-sm mt-1">{errors.symbol}</p>}
                            </div>

                            {/* Type (Masse, Volume, etc.) */}
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="type" className="block text-sm font-semibold mb-2">
                                    Catégorie de mesure <span className="text-destructive">*</span>
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                        errors.type ? 'border-destructive focus:ring-destructive' : 'border-input'
                                    }`}
                                >
                                    <option value="">Sélectionnez une catégorie...</option>
                                    <option value="masse">Masse (Kg, g, Tonne...)</option>
                                    <option value="volume">Volume (Litre, ml...)</option>
                                    <option value="longueur">Longueur (Mètre, cm...)</option>
                                    <option value="unitaire">Unitaire (Tête, Pièce...)</option>
                                    <option value="conditionnement">Conditionnement (Carton, Plateau, Sac...)</option>
                                </select>
                                {errors.type && <p className="text-destructive text-sm mt-1">{errors.type}</p>}
                            </div>

                            {/* Section Dynamique : Logique de conversion */}
                            <div className="col-span-1 md:col-span-2 bg-muted/30 p-5 rounded-lg border border-border mt-4">
                                <div className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        id="is_base_unit"
                                        checked={data.is_base_unit}
                                        onChange={(e) => setData('is_base_unit', e.target.checked)}
                                        className="h-5 w-5 rounded border-border text-primary focus:ring-primary bg-background"
                                    />
                                    <label htmlFor="is_base_unit" className="ml-3 block text-sm font-bold text-foreground">
                                        Il s'agit d'une Unité de Base (Référence)
                                    </label>
                                </div>
                                <p className="text-xs text-muted-foreground ml-8 mb-2">
                                    Décochez cette case si cette unité est un multiple ou un conditionnement d'une autre unité (ex: un Carton contenant des Kg).
                                </p>

                                {/* Affichage conditionnel des champs de conversion */}
                                {!data.is_base_unit && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 ml-8 pt-4 border-t border-border">
                                        <div>
                                            <label htmlFor="base_unit_id" className="block text-sm font-semibold mb-2">
                                                Unité de référence <span className="text-destructive">*</span>
                                            </label>
                                            <select
                                                id="base_unit_id"
                                                value={data.base_unit_id}
                                                onChange={(e) => setData('base_unit_id', e.target.value)}
                                                className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    errors.base_unit_id ? 'border-destructive focus:ring-destructive' : 'border-input'
                                                }`}
                                            >
                                                <option value="">Choisir l'unité de base...</option>
                                                {baseUnits.map((unit) => (
                                                    <option key={unit.id} value={unit.id}>
                                                        {unit.name} ({unit.symbol})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.base_unit_id && <p className="text-destructive text-sm mt-1">{errors.base_unit_id}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="conversion_rate" className="block text-sm font-semibold mb-2">
                                                Combien de référence dans 1 {data.symbol || 'unité'} ? <span className="text-destructive">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.000001"
                                                id="conversion_rate"
                                                value={data.conversion_rate}
                                                onChange={(e) => setData('conversion_rate', e.target.value)}
                                                placeholder="Ex: 30"
                                                className={`w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    errors.conversion_rate ? 'border-destructive focus:ring-destructive' : 'border-input'
                                                }`}
                                            />
                                            {errors.conversion_rate && <p className="text-destructive text-sm mt-1">{errors.conversion_rate}</p>}
                                        </div>
                                        
                                        {/* Feedback visuel mathématique pour aider l'utilisateur */}
                                        {data.symbol && data.base_unit_id && data.conversion_rate && (
                                            <div className="col-span-1 md:col-span-2 mt-2 text-sm bg-primary/10 text-primary p-3 rounded border border-primary/20">
                                                <strong>Formule comprise :</strong> 1 {data.symbol} = {data.conversion_rate} {baseUnits.find(u => u.id.toString() === data.base_unit_id)?.symbol}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Statut Actif */}
                            <div className="col-span-1 md:col-span-2 flex items-center mt-4">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary bg-background"
                                />
                                <label htmlFor="is_active" className="ml-3 block text-sm font-semibold text-foreground">
                                    L'unité est active et utilisable dans l'ERP
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
                            <Link
                                href={unitsIndex ? unitsIndex.url() : '/logistique/units'}
                                className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-md shadow-sm transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Enregistrement...' : 'Enregistrer l\'unité'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { unitsIndex } from '@/routes';

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
    conversion_rate: string | number;
    is_active: boolean;
}

interface Props {
    unit: Unit;
    baseUnits: BaseUnit[];
}

export default function UnitEdit({ unit, baseUnits }: Props) {
    const { data, setData, put, processing, errors, transform } = useForm({
        name: unit.name,
        symbol: unit.symbol,
        type: unit.type,
        is_base_unit: unit.is_base_unit,
        base_unit_id: unit.base_unit_id || '',
        conversion_rate: unit.conversion_rate || '',
        is_active: unit.is_active,
    });

    transform((data) => ({
        ...data,
        base_unit_id: data.is_base_unit ? null : data.base_unit_id,
        conversion_rate: data.is_base_unit ? 1.0 : parseFloat(data.conversion_rate.toString()),
    }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/units/${unit.id}`);
    };

    return (
        <div className="p-6 bg-background text-foreground min-h-screen font-sans">
            <Head title={`Modifier ${unit.symbol} | Ferme-Landi`} />

            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <h1 className="text-3xl font-bold tracking-tight">Modifier l'Unité</h1>
                    <Link href={unitsIndex.url()} className="bg-secondary/10 text-secondary py-2 px-4 rounded-md border border-secondary/20">
                        ← Retour
                    </Link>
                </div>

                <div className="bg-card text-card-foreground shadow-lg rounded-xl border border-border p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Nom</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Symbole</label>
                                <input type="text" value={data.symbol} onChange={e => setData('symbol', e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                                {errors.symbol && <p className="text-destructive text-sm mt-1">{errors.symbol}</p>}
                            </div>
                            
                            <div className="col-span-2 bg-muted/30 p-5 rounded-lg border border-border">
                                <div className="flex items-center mb-4">
                                    <input type="checkbox" id="is_base_unit" checked={data.is_base_unit} onChange={e => setData('is_base_unit', e.target.checked)} className="h-5 w-5 rounded border-border text-primary focus:ring-primary bg-background" />
                                    <label htmlFor="is_base_unit" className="ml-3 block text-sm font-bold">Unité de Base</label>
                                </div>

                                {!data.is_base_unit && (
                                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                                        <select value={data.base_unit_id} onChange={e => setData('base_unit_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                            <option value="">Choisir la base...</option>
                                            {baseUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                        <input type="number" step="0.000001" value={data.conversion_rate} onChange={e => setData('conversion_rate', e.target.value)} placeholder="Taux" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                    </div>
                                )}
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
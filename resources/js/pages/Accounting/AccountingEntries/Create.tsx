// pages/Accounting/AccountingEntries/Create.tsx
import React, { useMemo } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, BookOpen, Plus, Trash2, Scale, AlertTriangle } from 'lucide-react';
import { accountingEntriesIndex, accountingEntriesStore } from '@/routes';

interface Props {
    financialYears: { id: number; year: string }[];
    journals: { id: number; code: string; name: string }[];
    accounts: { id: number; number: string; name: string }[];
    centers: { id: number; short_name: string; name: string }[];
}

export default function Create({ financialYears, journals, accounts, centers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        financial_year_id: '',
        accounting_journal_id: '',
        date: new Date().toISOString().split('T')[0],
        reference: '',
        description: '',
        lines: [
            { account_id: '', analytical_center_id: '', debit: 0, credit: 0, description: '' },
            { account_id: '', analytical_center_id: '', debit: 0, credit: 0, description: '' }
        ],
    });

    const getLineError = (index: number, field: string) => {
        return errors[`lines.${index}.${field}` as keyof typeof errors];
    };

    // Calculs d'équilibre comptable
    const totalDebit = useMemo(() => data.lines.reduce((acc, line) => acc + Number(line.debit || 0), 0), [data.lines]);
    const totalCredit = useMemo(() => data.lines.reduce((acc, line) => acc + Number(line.credit || 0), 0), [data.lines]);
    const isBalanced = totalDebit === totalCredit;
    const balanceDifference = Math.abs(totalDebit - totalCredit);

    const addLine = () => {
        setData('lines', [...data.lines, { account_id: '', analytical_center_id: '', debit: 0, credit: 0, description: '' }]);
    };

    const removeLine = (index: number) => {
        if (data.lines.length > 2) {
            setData('lines', data.lines.filter((_, i) => i !== index));
        }
    };

    const updateLine = (index: number, field: string, value: any) => {
        const newLines = [...data.lines];
        
        // Un compte ne peut pas être débité ET crédité sur la même ligne
        if (field === 'debit' && Number(value) > 0) newLines[index].credit = 0;
        if (field === 'credit' && Number(value) > 0) newLines[index].debit = 0;
        
        newLines[index] = { ...newLines[index], [field]: value };
        setData('lines', newLines);
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(accountingEntriesStore.url());
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Head title="Saisie Comptable" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={[
                    { title: 'Comptabilité', href: '#' },
                    { title: 'Écritures', href: accountingEntriesIndex.url() },
                    { title: 'Saisie Manuelle', href: '#' },
                ]} />
                <Link href={accountingEntriesIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-bold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Vérifiez les champs en rouge avant de valider.
                    </div>
                )}

                {/* EN-TÊTE DE LA PIÈCE */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-5 border-b border-border bg-primary/5 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">En-tête de la pièce comptable</h2>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Exercice</label>
                            <select value={data.financial_year_id} onChange={e => setData('financial_year_id', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 font-bold outline-none">
                                <option value="">Choisir...</option>
                                {financialYears.map(fy => <option key={fy.id} value={fy.id}>{fy.year}</option>)}
                            </select>
                            {errors.financial_year_id && <p className="text-destructive text-[10px] font-bold">{errors.financial_year_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Journal</label>
                            <select value={data.accounting_journal_id} onChange={e => setData('accounting_journal_id', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 font-bold outline-none">
                                <option value="">Choisir...</option>
                                {journals.map(j => <option key={j.id} value={j.id}>{j.code} - {j.name}</option>)}
                            </select>
                            {errors.accounting_journal_id && <p className="text-destructive text-[10px] font-bold">{errors.accounting_journal_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Date comptable</label>
                            <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                            {errors.date && <p className="text-destructive text-[10px] font-bold">{errors.date}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">N° Pièce (Réf)</label>
                            <input type="text" value={data.reference} onChange={e => setData('reference', e.target.value)} placeholder="Ex: OD-2026-001" className="w-full bg-input border border-border rounded-lg px-3 py-2.5 font-mono font-bold" />
                            {errors.reference && <p className="text-destructive text-[10px] font-bold">{errors.reference}</p>}
                        </div>

                        <div className="md:col-span-4 space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Libellé général de l'opération</label>
                            <input type="text" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Ex: Achat de vaccins, Paiement fournisseur X..." className="w-full bg-input border border-border rounded-lg px-3 py-2.5 outline-none" />
                            {errors.description && <p className="text-destructive text-[10px] font-bold">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* LIGNES D'ÉCRITURE */}
                <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                        <h3 className="font-bold text-foreground text-sm uppercase tracking-widest">Détail des imputations</h3>
                        <button type="button" onClick={addLine} className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition">
                            <Plus className="w-4 h-4" /> Ajouter une ligne
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-muted/20 text-[10px] uppercase font-black text-muted-foreground border-b border-border">
                                <tr>
                                    <th className="px-4 py-3 w-[25%]">Compte Général</th>
                                    <th className="px-4 py-3 w-[20%]">Section Analytique</th>
                                    <th className="px-4 py-3 w-[25%]">Libellé ligne (Optionnel)</th>
                                    <th className="px-4 py-3 w-[12%] text-right text-emerald-600">Débit</th>
                                    <th className="px-4 py-3 w-[12%] text-right text-destructive">Crédit</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {data.lines.map((line, index) => (
                                    <tr key={index} className="group hover:bg-muted/10">
                                        <td className="px-4 py-2 align-top">
                                            <select value={line.account_id} onChange={e => updateLine(index, 'account_id', e.target.value)} className={`w-full bg-transparent border-none text-sm font-mono focus:ring-0 ${getLineError(index, 'account_id') ? 'text-destructive' : ''}`}>
                                                <option value="">Sélectionner un compte...</option>
                                                {accounts.map(a => <option key={a.id} value={a.id}>{a.number} - {a.name}</option>)}
                                            </select>
                                            {getLineError(index, 'account_id') && <p className="text-destructive text-[10px] font-bold px-2">{getLineError(index, 'account_id')}</p>}
                                        </td>
                                        <td className="px-4 py-2 align-top">
                                            <select value={line.analytical_center_id} onChange={e => updateLine(index, 'analytical_center_id', e.target.value)} className="w-full bg-transparent border-none text-sm focus:ring-0 text-muted-foreground">
                                                <option value="">Aucun centre...</option>
                                                {centers.map(c => <option key={c.id} value={c.id}>{c.short_name}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2 align-top">
                                            <input type="text" value={line.description} onChange={e => updateLine(index, 'description', e.target.value)} placeholder="Libellé spécifique..." className="w-full bg-transparent border-none text-sm focus:ring-0" />
                                        </td>
                                        <td className="px-4 py-2 align-top">
                                            <input type="number" min="0" step="0.01" value={line.debit || ''} onChange={e => updateLine(index, 'debit', e.target.value)} className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded px-2 py-1.5 text-sm font-bold text-emerald-600 text-right focus:bg-background" placeholder="0" />
                                            {getLineError(index, 'debit') && <p className="text-destructive text-[10px] font-bold px-2 text-right">{getLineError(index, 'debit')}</p>}
                                        </td>
                                        <td className="px-4 py-2 align-top">
                                            <input type="number" min="0" step="0.01" value={line.credit || ''} onChange={e => updateLine(index, 'credit', e.target.value)} className="w-full bg-destructive/5 border border-destructive/20 rounded px-2 py-1.5 text-sm font-bold text-destructive text-right focus:bg-background" placeholder="0" />
                                            {getLineError(index, 'credit') && <p className="text-destructive text-[10px] font-bold px-2 text-right">{getLineError(index, 'credit')}</p>}
                                        </td>
                                        <td className="px-4 py-2 align-top pt-3 text-right">
                                            {data.lines.length > 2 && (
                                                <button type="button" onClick={() => removeLine(index)} className="text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PIED DE TABLEAU - ÉQUILIBRE COMPTABLE */}
                    <div className="p-4 bg-muted/20 border-t border-border flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Scale className={`w-6 h-6 ${isBalanced ? 'text-emerald-500' : 'text-destructive'}`} />
                            <span className={`text-sm font-bold ${isBalanced ? 'text-emerald-600' : 'text-destructive'}`}>
                                {isBalanced ? 'Pièce équilibrée' : `Déséquilibre de ${balanceDifference.toLocaleString()} FCFA`}
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">Total Débit</p>
                                <p className="text-lg font-black text-emerald-600">{totalDebit.toLocaleString()} <span className="text-xs">FCFA</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-muted-foreground">Total Crédit</p>
                                <p className="text-lg font-black text-destructive">{totalCredit.toLocaleString()} <span className="text-xs">FCFA</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="submit" disabled={processing || !isBalanced || totalDebit === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                        <Save className="w-5 h-5" />
                        {processing ? 'Enregistrement...' : 'Enregistrer la pièce (Brouillon)'}
                    </button>
                </div>
            </form>
        </div>
    );
}
import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Settings, GitMerge, Key } from 'lucide-react';

interface Props {
    journals: { id: number; code: string; name: string }[];
    accounts: { id: number; number: string; name: string }[];
    natures: { id: number; code: string; name: string }[];
}

export default function Create({ journals, accounts, natures }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        event_type: '',
        name: '',
        accounting_journal_id: '',
        debit_account_id: '',
        credit_account_id: '',
        analytical_nature_id: '',
    });

    const breadcrumbs = [
        { title: 'Comptabilité', href: '#' },
        { title: 'Mappings Comptables', href: '/accounting/accounting-mappings' },
        { title: 'Nouveau Paramétrage', href: '#' },
    ];

    // Règle d'or : Utilisation du SubmitEvent natif et URL en dur
    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        
        post('/accounting/accounting-mappings');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Head title="SINTF | Nouveau Mapping Comptable" />
            
            <div className="flex justify-between items-center">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href="/accounting/accounting-mappings" className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            {/* Hack TypeScript pour imposer l'usage du SubmitEvent natif */}
            <form onSubmit={handleSubmit as unknown as React.FormEventHandler<HTMLFormElement>} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-bold">
                        Veuillez corriger les erreurs indiquées en rouge ci-dessous avant de sauvegarder.
                    </div>
                )}

                {/* 1. IDENTIFICATION DE L'ÉVÉNEMENT */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border bg-primary/5 flex items-center gap-3">
                        <Settings className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Déclencheur Métier</h2>
                            <p className="text-sm text-muted-foreground">Sélectionnez l'action de l'ERP qui va générer l'écriture.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Type d'Événement</label>
                            <select
                                value={data.event_type}
                                onChange={(e) => setData('event_type', e.target.value)}
                                className={`w-full bg-background border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 ${errors.event_type ? 'border-destructive' : 'border-border'}`}
                            >
                                <option value="">Sélectionner un événement métier...</option>
                                <option value="customer_invoice">Vente (Validation d'une Facture Client)</option>
                                <option value="supplier_invoice">Achat (Validation d'une Facture Fournisseur)</option>
                                <option value="payroll">RH (Validation d'une Fiche de Paie)</option>
                            </select>
                            {errors.event_type && <p className="text-destructive text-[10px] font-bold">{errors.event_type}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Nom descriptif de la règle</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ex: Règle standard des ventes de volailles"
                                className={`w-full bg-background border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-destructive' : 'border-border'}`}
                            />
                            {errors.name && <p className="text-destructive text-[10px] font-bold">{errors.name}</p>}
                        </div>
                    </div>
                </div>

                {/* 2. PARAMÉTRAGE DES COMPTES */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border bg-accent/10 flex items-center gap-3">
                        <GitMerge className="w-6 h-6 text-accent-foreground" />
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Imputation Comptable</h2>
                            <p className="text-sm text-muted-foreground">Définissez les comptes de la partie double et le journal cible.</p>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Journal Cible</label>
                            <select
                                value={data.accounting_journal_id}
                                onChange={(e) => setData('accounting_journal_id', e.target.value)}
                                className={`w-full bg-background border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 ${errors.accounting_journal_id ? 'border-destructive' : 'border-border'}`}
                            >
                                <option value="">Sélectionner le journal d'écriture...</option>
                                {journals.map((journal) => (
                                    <option key={journal.id} value={journal.id}>
                                        {journal.code} - {journal.name}
                                    </option>
                                ))}
                            </select>
                            {errors.accounting_journal_id && <p className="text-destructive text-[10px] font-bold">{errors.accounting_journal_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                                <Key className="w-3 h-3" /> Nature Analytique (Optionnel)
                            </label>
                            <select
                                value={data.analytical_nature_id}
                                onChange={(e) => setData('analytical_nature_id', e.target.value)}
                                className={`w-full bg-background border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 ${errors.analytical_nature_id ? 'border-destructive' : 'border-border'}`}
                            >
                                <option value="">Ne pas lier à l'analytique</option>
                                {natures.map((nature) => (
                                    <option key={nature.id} value={nature.id}>
                                        {nature.code} - {nature.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[10px] text-muted-foreground italic mt-1">Permet le routage automatique vers le bon centre selon le produit/employé.</p>
                            {errors.analytical_nature_id && <p className="text-destructive text-[10px] font-bold">{errors.analytical_nature_id}</p>}
                        </div>

                        <div className="space-y-1.5 md:col-span-2 pt-4 border-t border-border"></div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Compte de Débit</label>
                            <select
                                value={data.debit_account_id}
                                onChange={(e) => setData('debit_account_id', e.target.value)}
                                className={`w-full bg-background border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 ${errors.debit_account_id ? 'border-destructive' : 'border-border'}`}
                            >
                                <option value="">Sélectionner un compte de débit...</option>
                                {accounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.number} - {account.name}
                                    </option>
                                ))}
                            </select>
                            {errors.debit_account_id && <p className="text-destructive text-[10px] font-bold">{errors.debit_account_id}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Compte de Crédit</label>
                            <select
                                value={data.credit_account_id}
                                onChange={(e) => setData('credit_account_id', e.target.value)}
                                className={`w-full bg-background border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 ${errors.credit_account_id ? 'border-destructive' : 'border-border'}`}
                            >
                                <option value="">Sélectionner un compte de crédit...</option>
                                {accounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.number} - {account.name}
                                    </option>
                                ))}
                            </select>
                            {errors.credit_account_id && <p className="text-destructive text-[10px] font-bold">{errors.credit_account_id}</p>}
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-black transition-all shadow-md shadow-primary/10 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {processing ? 'Enregistrement...' : 'Sauvegarder le paramétrage'}
                    </button>
                </div>
            </form>
        </div>
    );
}
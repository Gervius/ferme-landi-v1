import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    FileText, 
    CheckCircle2, 
    Clock, 
    Check,
    Building2,
    Calendar,
    Hash,
    Receipt
} from 'lucide-react';
import { supplierInvoicesCreate, supplierInvoicesApprove } from '@/routes';

interface SupplierInvoice {
    id: number;
    reference: string;
    invoice_date: string;
    due_date: string | null;
    status: 'draft' | 'approved';
    supplier: {
        name: string;
    };
    purchase_receipt: {
        reference: string;
    };
}

interface Props {
    data: {
        data: SupplierInvoice[];
        links: any[];
    };
}

export default function SupplierInvoiceIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Achats & Stocks', href: '#' },
        { title: 'Factures Fournisseurs', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Approuver cette facture fournisseur ? Elle sera comptabilisée comme une dette exigible.')) {
            post(supplierInvoicesApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Factures Achats" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={supplierInvoicesCreate.url()}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Enregistrer Facture
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-orange-500/10 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <h2 className="font-bold text-lg text-foreground">Registre des Factures Fournisseurs</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Réf. Facture</th>
                            <th className="px-6 py-4">Fournisseur / Arrivage</th>
                            <th className="px-6 py-4 text-center">Dates</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                                    Aucune facture fournisseur enregistrée.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground">{invoice.reference}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                                            <Building2 className="w-3.5 h-3.5 text-orange-600" />
                                            {invoice.supplier.name}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase mt-1">
                                            <Receipt className="w-3 h-3" /> Arrivage: {invoice.purchase_receipt.reference}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-medium">Facture: {new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}</span>
                                            {invoice.due_date && (
                                                <span className="text-[10px] text-orange-600 font-bold uppercase italic">
                                                    Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                            invoice.status === 'approved' 
                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                            : 'bg-muted text-muted-foreground border-border'
                                        }`}>
                                            {invoice.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {invoice.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {invoice.status === 'draft' && (
                                            <button
                                                onClick={() => handleApprove(invoice.id)}
                                                disabled={processing}
                                                className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition shadow-sm"
                                                title="Valider la facture"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    FileText, 
    CheckCircle2, 
    Clock, 
    Check,
    User,
    CalendarDays,
    Hash,
    AlertCircle
} from 'lucide-react';
// Assure-toi d'importer tes routes
import { invoicesCreate, invoicesApprove } from '@/routes';

interface Invoice {
    id: number;
    reference: string;
    invoice_date: string;
    due_date: string;
    status: 'draft' | 'approved';
    customer: {
        name: string;
    };
    delivery_note: {
        reference: string;
    };
}

interface Props {
    data: {
        data: Invoice[];
        links: any[];
    };
}

export default function InvoiceIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Ventes & Commercial', href: '#' },
        { title: 'Facturation', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Valider cette facture ? Elle sera considérée comme définitive et prête à être encaissée.')) {
            post(invoicesApprove.url(id));
        }
    };

    // Fonction pour vérifier si la facture est en retard (Échue)
    const isOverdue = (dueDate: string, status: string) => {
        if (status !== 'approved') return false;
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Factures" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={invoicesCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle Facture
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Registre des Factures</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">N° Facture</th>
                            <th className="px-6 py-4">Client / Réf. BL</th>
                            <th className="px-6 py-4">Émission & Échéance</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                                    Aucune facture émise pour le moment.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((invoice) => {
                                const overdue = isOverdue(invoice.due_date, invoice.status);

                                return (
                                    <tr key={invoice.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-black text-foreground text-base">{invoice.reference}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                                                <User className="w-3.5 h-3.5 text-secondary" />
                                                {invoice.customer.name}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase mt-1">
                                                <Hash className="w-3 h-3" /> BL Lié: {invoice.delivery_note.reference}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground">
                                                    Émise: {new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}
                                                </span>
                                                <span className={`text-xs font-bold flex items-center gap-1 ${overdue ? 'text-destructive' : 'text-foreground'}`}>
                                                    <CalendarDays className="w-3.5 h-3.5" />
                                                    Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}
                                                    {overdue && (
                                                        <span title="Facture en retard" className="flex items-center">
                                                            <AlertCircle className="w-3 h-3 ml-1" />
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                                invoice.status === 'approved' 
                                                ? 'bg-primary/10 text-primary border-primary/20' 
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
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
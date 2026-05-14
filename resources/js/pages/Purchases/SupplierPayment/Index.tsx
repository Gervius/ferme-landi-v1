import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    Wallet, 
    CheckCircle2, 
    Clock, 
    Check,
    Building2,
    Calendar,
    ArrowUpRight,
    CreditCard,
    Smartphone,
    Banknote,
    CircleDollarSign
} from 'lucide-react';
import { supplierPaymentsCreate, supplierPaymentsApprove } from '@/routes';

interface SupplierPayment {
    id: number;
    reference: string;
    payment_date: string;
    amount: number;
    payment_method: 'especes' | 'cheque' | 'virement' | 'mobile_money';
    status: 'draft' | 'approved';
    supplier: {
        name: string;
    };
}

interface Props {
    data: {
        data: SupplierPayment[];
        links: any[];
    };
}

export default function SupplierPaymentIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Achats & Stocks', href: '#' },
        { title: 'Paiements émis', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Confirmer ce paiement fournisseur ? L\'argent sera déduit de la trésorerie.')) {
            post(supplierPaymentsApprove.url(id));
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'virement': return <ArrowUpRight className="w-3.5 h-3.5" />;
            case 'mobile_money': return <Smartphone className="w-3.5 h-3.5" />;
            case 'cheque': return <CreditCard className="w-3.5 h-3.5" />;
            case 'especes': return <Banknote className="w-3.5 h-3.5" />;
            default: return <CircleDollarSign className="w-3.5 h-3.5" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Paiements Fournisseurs" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={supplierPaymentsCreate.url()}
                    className="inline-flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau Paiement
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-destructive/5 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-destructive" />
                    <h2 className="font-bold text-lg text-foreground">Historique des Décaissements</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Réf. / Date</th>
                            <th className="px-6 py-4">Fournisseur Payé</th>
                            <th className="px-6 py-4">Méthode</th>
                            <th className="px-6 py-4 text-right">Montant (FCFA)</th>
                            <th className="px-6 py-4 text-center">Statut</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic">
                                    Aucun paiement émis pour le moment.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((payment) => (
                                <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground">{payment.reference}</div>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(payment.payment_date).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                                            {payment.supplier.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-bold capitalize italic">
                                            {getMethodIcon(payment.payment_method)}
                                            {payment.payment_method.replace('_', ' ')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-foreground text-base">
                                        {payment.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                                payment.status === 'approved' 
                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                                : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                                            }`}>
                                                {payment.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {payment.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {payment.status === 'draft' && (
                                            <button
                                                onClick={() => handleApprove(payment.id)}
                                                disabled={processing}
                                                className="bg-emerald-600 text-white p-1.5 rounded-md hover:bg-emerald-700 transition shadow-sm"
                                                title="Approuver le décaissement"
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
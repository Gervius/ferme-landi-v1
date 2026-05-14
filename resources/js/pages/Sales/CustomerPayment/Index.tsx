import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    HandCoins, 
    CheckCircle2, 
    Clock, 
    Check,
    User,
    Calendar,
    Wallet,
    CreditCard,
    Smartphone,
    Banknote
} from 'lucide-react';
import { customerPaymentsCreate, customerPaymentsApprove } from '@/routes';

interface Payment {
    id: number;
    reference: string;
    payment_date: string;
    amount: number;
    payment_method: 'especes' | 'cheque' | 'virement' | 'mobile_money';
    status: 'draft' | 'approved';
    customer: {
        name: string;
    };
}

interface Props {
    data: {
        data: Payment[];
        links: any[];
    };
}

export default function CustomerPaymentIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Ventes & Commercial', href: '#' },
        { title: 'Paiements Clients', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Confirmer cet encaissement ? Cette action est irréversible.')) {
            post(customerPaymentsApprove.url(id));
        }
    };

    const getMethodIcon = (method: string) => {
        switch (method) {
            case 'especes': return <Banknote className="w-3.5 h-3.5" />;
            case 'mobile_money': return <Smartphone className="w-3.5 h-3.5" />;
            case 'cheque': return <CreditCard className="w-3.5 h-3.5" />;
            case 'virement': return <Wallet className="w-3.5 h-3.5" />;
            default: return null;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Paiements" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={customerPaymentsCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Enregistrer Paiement
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-emerald-500/5 flex items-center gap-2">
                    <HandCoins className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Flux de Trésorerie Clients</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Réf. / Date</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Méthode</th>
                            <th className="px-6 py-4 text-right">Montant (FCFA)</th>
                            <th className="px-6 py-4 text-center">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground italic">
                                    Aucun paiement enregistré.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground">{item.reference}</div>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 font-bold uppercase">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.payment_date).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                                            <User className="w-3.5 h-3.5 text-secondary" />
                                            {item.customer.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium capitalize">
                                            {getMethodIcon(item.payment_method)}
                                            {item.payment_method.replace('_', ' ')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-foreground text-base">
                                        {item.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                                item.status === 'approved' 
                                                ? 'bg-primary/10 text-primary border-primary/20' 
                                                : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                                            }`}>
                                                {item.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {item.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {item.status === 'draft' && (
                                            <button
                                                onClick={() => handleApprove(item.id)}
                                                disabled={processing}
                                                className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition shadow-sm"
                                                title="Approuver l'encaissement"
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
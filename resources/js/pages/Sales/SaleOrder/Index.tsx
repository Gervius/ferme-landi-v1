import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    ShoppingCart, 
    CheckCircle2, 
    Clock, 
    FileText, 
    Truck, 
    MoreHorizontal,
    User,
    Calendar
} from 'lucide-react';
import { saleOrdersCreate, saleOrdersEdit } from '@/routes';

interface SaleOrder {
    id: number;
    reference: string;
    order_date: string;
    status: 'draft' | 'validated' | 'partially_delivered' | 'delivered' | 'closed';
    total_amount?: number; // Calculé par le backend
    customer: {
        name: string;
    };
}

interface Props {
    data: {
        data: SaleOrder[];
        links: any[];
    };
}

export default function SaleOrderIndex({ data }: Props) {
    const breadcrumbs = [
        { title: 'Ventes & Commercial', href: '#' },
        { title: 'Commandes Clients', href: '#' },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'validated': return 'bg-primary/10 text-primary border-primary/20';
            case 'delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'draft': return 'bg-muted text-muted-foreground border-border';
            default: return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Commandes" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={saleOrdersCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Créer une commande
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Gestion des Commandes</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Référence / Date</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                    Aucune commande en cours.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((order) => (
                                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground">{order.reference}</div>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(order.order_date).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <User className="w-4 h-4 text-secondary" />
                                            {order.customer.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            href={saleOrdersEdit.url(order.id)}
                                            className="p-2 text-muted-foreground hover:text-primary transition inline-block"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Link>
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
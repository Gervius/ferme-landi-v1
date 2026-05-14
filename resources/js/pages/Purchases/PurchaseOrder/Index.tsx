import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    ClipboardList, 
    CheckCircle2, 
    Clock, 
    Truck, 
    MoreHorizontal,
    Building2,
    Calendar,
    Ban
} from 'lucide-react';
// Import des routes
import { purchaseOrdersCreate, purchaseOrdersEdit } from '@/routes';

interface PurchaseOrder {
    id: number;
    reference: string;
    order_date: string;
    status: 'draft' | 'validated' | 'partially_received' | 'received' | 'cancelled';
    supplier: {
        name: string;
    };
}

interface Props {
    data: {
        data: PurchaseOrder[];
        links: any[];
    };
}

export default function PurchaseOrderIndex({ data }: Props) {
    const breadcrumbs = [
        { title: 'Achats & Stocks', href: '#' },
        { title: 'Commandes Fournisseurs', href: '#' },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'validated': return 'bg-primary/10 text-primary border-primary/20';
            case 'received': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
            case 'draft': return 'bg-muted text-muted-foreground border-border';
            default: return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Achats" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={purchaseOrdersCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle Commande
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Commandes d'Approvisionnement</h2>
                </div>

                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Réf. Achat</th>
                            <th className="px-6 py-4">Fournisseur</th>
                            <th className="px-6 py-4">Date de Commande</th>
                            <th className="px-6 py-4 text-center">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                                    Aucun bon de commande d'achat enregistré.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((order) => (
                                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground">{order.reference}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-foreground">
                                            <Building2 className="w-4 h-4 text-secondary" />
                                            {order.supplier.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {new Date(order.order_date).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(order.status)}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            href={purchaseOrdersEdit.url(order.id)}
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
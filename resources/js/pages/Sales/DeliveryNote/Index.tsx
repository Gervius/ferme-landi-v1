import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    Truck, 
    CheckCircle2, 
    Clock, 
    Check,
    User,
    Hash,
    Calendar
} from 'lucide-react';
import { deliveryNotesApprove, deliveryNotesCreate } from '@/routes';

interface DeliveryNote {
    id: number;
    reference: string;
    delivery_date: string;
    status: 'draft' | 'approved';
    sale_order?: {
        reference: string;
        customer: {
            name: string;
        };
    };
}

interface Props {
    data: {
        data: DeliveryNote[];
        links: any[];
    };
}

export default function DeliveryNoteIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Ventes & Commercial', href: '#' },
        { title: 'Bons de Livraison', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Approuver cette livraison ? Cela déduira définitivement les quantités du stock.')) {
            post(deliveryNotesApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Livraisons" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={deliveryNotesCreate.url()}
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle Livraison
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-secondary/5 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-secondary" />
                    <h2 className="font-bold text-lg text-foreground">Suivi des Expéditions</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Réf. Livraison</th>
                            <th className="px-6 py-4">Commande / Client</th>
                            <th className="px-6 py-4">Date de sortie</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                                    Aucun bon de livraison enregistré.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground">{item.reference}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.sale_order ? (
                                            <>
                                                <div className="flex items-center gap-1.5 text-foreground font-medium">
                                                    <Hash className="w-3 h-3 text-muted-foreground" />
                                                    {item.sale_order.reference}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase">
                                                    <User className="w-3 h-3" />
                                                    {item.sale_order.customer.name}
                                                </div>
                                            </>
                                        ) : <span className="text-muted-foreground">Livraison directe</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {new Date(item.delivery_date).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                            item.status === 'approved' 
                                            ? 'bg-primary/10 text-primary border-primary/20' 
                                            : 'bg-muted text-muted-foreground border-border'
                                        }`}>
                                            {item.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {item.status === 'draft' && (
                                            <button
                                                onClick={() => handleApprove(item.id)}
                                                disabled={processing}
                                                className="bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition shadow-sm"
                                                title="Approuver et déstocker"
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
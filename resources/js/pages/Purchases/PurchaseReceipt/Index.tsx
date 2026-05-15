import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { 
    Plus, 
    PackageOpen, 
    CheckCircle2, 
    Clock, 
    Check,
    Hash,
    CalendarDays
} from 'lucide-react';
import { purchaseReceiptsCreate, purchaseReceiptsApprove } from '@/routes';

interface PurchaseReceipt {
    id: number;
    reference: string;
    receipt_date: string;
    status: 'draft' | 'approved';
    purchase_order?: {
        reference: string;
    };
}

interface Props {
    data: {
        data: PurchaseReceipt[];
        links: any[];
    };
}

export default function PurchaseReceiptIndex({ data }: Props) {
    const { post, processing } = useForm();

    const breadcrumbs = [
        { title: 'Achats & Stocks', href: '#' },
        { title: 'Bons de Réception', href: '#' },
    ];

    const handleApprove = (id: number) => {
        if (confirm('Approuver cette réception ? Cela ajoutera définitivement les quantités au stock.')) {
            post(purchaseReceiptsApprove.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Réceptions" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={purchaseReceiptsCreate.url()}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle Réception
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-emerald-500/10 flex items-center gap-2">
                    <PackageOpen className="w-5 h-5 text-emerald-600" />
                    <h2 className="font-bold text-lg text-foreground">Suivi des Arrivages (Entrées de Stock)</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Réf. Réception</th>
                            <th className="px-6 py-4">Commande Source</th>
                            <th className="px-6 py-4">Date de Réception</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground italic">
                                    Aucun bon de réception enregistré.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((receipt) => (
                                <tr key={receipt.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-foreground">{receipt.reference}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {receipt.purchase_order ? (
                                            <div className="flex items-center gap-1.5 text-foreground font-medium">
                                                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                                                {receipt.purchase_order.reference}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic text-xs">Réception libre</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                            {new Date(receipt.receipt_date).toLocaleDateString('fr-FR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center w-fit gap-1 border ${
                                            receipt.status === 'approved' 
                                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                                            : 'bg-muted text-muted-foreground border-border'
                                        }`}>
                                            {receipt.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {receipt.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {receipt.status === 'draft' && (
                                            <button
                                                onClick={() => handleApprove(receipt.id)}
                                                disabled={processing}
                                                className="bg-emerald-600 text-white p-1.5 rounded-md hover:bg-emerald-700 transition shadow-sm"
                                                title="Approuver et mettre en stock"
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
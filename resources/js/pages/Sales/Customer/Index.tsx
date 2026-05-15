import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Users, Phone, Mail, MapPin } from 'lucide-react';
// Assure-toi d'importer les routes générées (customersCreate, customersEdit, customersDestroy)
import { customersCreate, customersEdit, customersDestroy } from '@/routes';

interface Customer {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    is_active: boolean;
}

interface Props {
    data: {
        data: Customer[];
    };
}

export default function CustomerIndex({ data }: Props) {
    const { delete: destroy } = useForm();

    const breadcrumbs = [
        { title: 'Ventes & Commercial', href: '#' },
        { title: 'Clients', href: '#' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer ce client ? (Impossible s\'il a des commandes liées)')) {
            destroy(customersDestroy.url(id));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Head title="Ferme-Landi | Clients" />
            
            <div className="flex justify-between items-start">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link
                    href={customersCreate.url()}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau Client
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden text-sm">
                <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">Répertoire Clients</h2>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4">Nom / Raison Sociale</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Adresse</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    Aucun client enregistré.
                                </td>
                            </tr>
                        ) : (
                            data.data.map((customer) => (
                                <tr key={customer.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-black text-foreground text-base">
                                        {customer.name}
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="flex items-center gap-2 text-foreground font-medium">
                                            <Phone className="w-3.5 h-3.5 text-secondary" />
                                            {customer.phone}
                                        </div>
                                        {customer.email && (
                                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                                <Mail className="w-3.5 h-3.5" />
                                                {customer.email}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            {customer.address ? (
                                                <>
                                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                    <span className="line-clamp-2 leading-relaxed">{customer.address}</span>
                                                </>
                                            ) : (
                                                <span className="italic">Non renseignée</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {customer.is_active ? (
                                            <span className="flex items-center gap-1 text-xs font-bold text-primary">
                                                <CheckCircle2 className="w-4 h-4" /> Actif
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                                                <XCircle className="w-4 h-4" /> Inactif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <Link 
                                            href={customersEdit.url(customer.id)}
                                            className="p-2 text-muted-foreground hover:text-primary transition"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(customer.id)}
                                            className="p-2 text-muted-foreground hover:text-destructive transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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
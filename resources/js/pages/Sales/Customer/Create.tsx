import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Save, ArrowLeft, Users, Phone, Mail, MapPin } from 'lucide-react';
import { customersIndex, customersStore } from '@/routes';

export default function CreateCustomer() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const breadcrumbs = [
        { title: 'Ventes & Commercial', href: '#' },
        { title: 'Clients', href: customersIndex.url() },
        { title: 'Nouveau Client', href: '#' },
    ];

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(customersStore.url());
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <Head title="Ferme-Landi | Nouveau Client" />
            
            <div className="flex justify-between items-center text-sm">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <Link href={customersIndex.url()} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition">
                    <ArrowLeft className="w-4 h-4" /> Retour
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                <div className="p-6 border-b border-border bg-primary/5 flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Fiche Client</h2>
                        <p className="text-sm text-muted-foreground">Enregistrez un nouveau client ou distributeur.</p>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Nom */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Nom complet ou Raison Sociale</label>
                        <input
                            type="text"
                            placeholder="Ex: Coopérative Agricole du Sud"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition text-foreground font-semibold"
                        />
                        {errors.name && <p className="text-destructive text-[10px] font-bold">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Téléphone */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-secondary" /> Numéro de téléphone
                            </label>
                            <input
                                type="text"
                                placeholder="Ex: +226 70 00 00 00"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition"
                            />
                            {errors.phone && <p className="text-destructive text-[10px] font-bold">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-accent" /> Adresse Email
                            </label>
                            <input
                                type="email"
                                placeholder="Ex: contact@client.com"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition"
                            />
                            {errors.email && <p className="text-destructive text-[10px] font-bold">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Adresse */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Adresse physique / Localisation
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Quartier, Ville, Indications..."
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
                        />
                        {errors.address && <p className="text-destructive text-[10px] font-bold">{errors.address}</p>}
                    </div>
                </div>

                <div className="p-6 bg-muted/20 border-t border-border flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2.5 rounded-lg font-black transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {processing ? 'Enregistrement...' : 'Enregistrer le client'}
                    </button>
                </div>
            </form>
        </div>
    );
}
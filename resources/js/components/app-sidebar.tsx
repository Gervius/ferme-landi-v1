// components/app-sidebar.tsx
import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Layers, 
    Bird, 
    Package, 
    Settings2, 
    MapPin,
    Scale,
    Tags,
    Activity,
    Egg,
    Utensils,
    Stethoscope,
    Skull,
    TrendingDown,
    Building2,
    Target,
    ShieldPlus,
    ShoppingCart,
    Users,
    FileText,
    Gift,
    ArrowRightLeft,
    CalendarCheck,
    Dna,
    Component,
    Truck,
    ClipboardList,
    PackageOpen,
    Wallet,
    Receipt,
    HandCoins,
    Briefcase, 
    Banknote,
    // --- NOUVELLES ICÔNES POUR LA COMPTABILITÉ ---
    Calculator,
    Landmark,
    BookOpen,
    BookDashed,
    CalendarDays,
    Hash,
    Tag
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

// Importation de toutes les routes
import { 
    dashboard, 
    // Paramétrage
    sitesIndex, 
    unitsIndex, 
    categoriesIndex, 
    breedStandardsIndex,
    speciesIndex,             
    breedsIndex,              
    prophylaxisProgramsIndex,
    // Zootechnie
    generationsIndex, 
    dailyProductionsIndex,
    feedConsumptionsIndex,
    flockMortalitiesIndex,
    flockCullingsIndex,
    flockWeighingsIndex,
    healthTreatmentsIndex,
    scheduledTreatmentsIndex, 
    // Ventes
    customersIndex,
    saleOrdersIndex,
    deliveryNotesIndex,
    invoicesIndex,
    customerPaymentsIndex,
    productDonationsIndex,
    // Achats
    suppliersIndex,
    purchaseOrdersIndex,
    purchaseReceiptsIndex,
    supplierInvoicesIndex,
    supplierPaymentsIndex,
    // Ressources Humaines
    employeesIndex,
    payrollRecordsIndex,
    // Stocks
    stockBalancesIndex,
    stockMovementsIndex,
    // --- NOUVELLES ROUTES COMPTABILITÉ ---
    accountingEntriesIndex,
    accountsIndex,
    accountingJournalsIndex,
    financialYearsIndex,
    analyticalNaturesIndex,
    analyticalCodesIndex,
    analyticalCentersIndex
} from '@/routes';

import type { NavItem } from '@/types';

// ============================================================================
// 1. DOMAINES OPÉRATIONNELS (Le Quotidien de la Ferme)
// ============================================================================
const mainNavItems: NavItem[] = [
    {
        title: 'Tableau de Bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Zootechnie (Production)',
        icon: Bird,
        href: '#',
        children: [
            { title: 'Lots & Générations', href: generationsIndex(), icon: Layers },
            { title: 'Alimentation', href: feedConsumptionsIndex(), icon: Utensils },
            { title: 'Production d\'Œufs', href: dailyProductionsIndex(), icon: Egg },
            { title: 'Pesée & Croissance', href: flockWeighingsIndex(), icon: Activity },
            { title: 'Santé & Soins', href: healthTreatmentsIndex(), icon: Stethoscope },
            { title: 'Calendrier Sanitaire', href: scheduledTreatmentsIndex(), icon: CalendarCheck },
            { title: 'Mortalité', href: flockMortalitiesIndex(), icon: Skull },
            { title: 'Réforme & Sorties', href: flockCullingsIndex(), icon: TrendingDown },
        ],
    },
    {
        title: 'Achats & Dépenses',
        icon: Truck,
        href: '#',
        children: [
            { title: 'Fournisseurs', href: suppliersIndex(), icon: Building2 },
            { title: 'Commandes Achat', href: purchaseOrdersIndex(), icon: ClipboardList },
            { title: 'Réceptions Stock', href: purchaseReceiptsIndex(), icon: PackageOpen },
            { title: 'Factures Achats', href: supplierInvoicesIndex(), icon: FileText },
            { title: 'Décaissements', href: supplierPaymentsIndex(), icon: Wallet },
        ],
    },
    {
        title: 'Ventes & Revenus',
        icon: ShoppingCart,
        href: '#',
        children: [
            { title: 'Clients', href: customersIndex(), icon: Users },
            { title: 'Commandes Client', href: saleOrdersIndex(), icon: ShoppingCart },
            { title: 'Bons de livraison', href: deliveryNotesIndex(), icon: Package },
            { title: 'Factures Clients', href: invoicesIndex(), icon: Receipt },
            { title: 'Encaissements', href: customerPaymentsIndex(), icon: HandCoins },
            { title: 'Dons & Œuvres', href: productDonationsIndex(), icon: Gift },
        ],
    },
    {
        title: 'Ressources Humaines',
        icon: Briefcase,
        href: '#',
        children: [
            { title: 'Personnel & Employés', href: employeesIndex(), icon: Users },
            { title: 'Gestion de la Paie', href: payrollRecordsIndex(), icon: Banknote },
        ],
    },
    {
        title: 'Stocks & Logistique',
        icon: ArrowRightLeft,
        href: '#',
        children: [
            { title: 'Mouvements Stock', href: stockMovementsIndex(), icon: ArrowRightLeft },
            { title: 'État des stocks', href: stockBalancesIndex(), icon: LayoutGrid },
        ],
    },
    // ---- NOUVEAU BLOC COMPTABILITÉ (OPÉRATIONNEL) ----
    {
        title: 'Comptabilité & Finances',
        icon: Calculator,
        href: '#',
        children: [
            { title: 'Écritures Comptables', href: accountingEntriesIndex(), icon: BookOpen },
        ],
    },
];

// ============================================================================
// 2. PARAMÉTRAGE MÉTIER (L'Administration du Système)
// ============================================================================
const configNavItems: NavItem[] = [
    {
        title: 'Configuration ERP',
        icon: Settings2,
        href: '#',
        children: [
            // Structure
            { title: 'Entreprises & Filiales', href: '#', icon: Building2 },
            { title: 'Sites & Bâtiments', href: sitesIndex(), icon: MapPin },
            
            // Référentiel Zootechnique
            { title: 'Espèces', href: speciesIndex(), icon: Dna },
            { title: 'Races / Souches', href: breedsIndex(), icon: Component },
            { title: 'Standards de Race', href: breedStandardsIndex(), icon: Target },
            { title: 'Prog. Prophylactiques', href: prophylaxisProgramsIndex(), icon: ShieldPlus },
            
            // Système
            { title: 'Unités de mesure', href: unitsIndex(), icon: Scale },
            { title: 'Catégories & Articles', href: categoriesIndex(), icon: Tags },
        ],
    },
    // ---- NOUVEAU BLOC COMPTABILITÉ (PARAMÉTRAGE) ----
    {
        title: 'Comptabilité (Configuration)',
        icon: Landmark,
        href: '#',
        children: [
            { title: 'Exercices Fiscaux', href: financialYearsIndex(), icon: CalendarDays },
            { title: 'Plan Comptable', href: accountsIndex(), icon: BookDashed },
            { title: 'Journaux', href: accountingJournalsIndex(), icon: FileText },
            { title: 'Natures Analytiques', href: analyticalNaturesIndex(), icon: Tag },
            { title: 'Sections Analytiques', href: analyticalCodesIndex(), icon: Hash },
            { title: 'Centres Analytiques', href: analyticalCentersIndex(), icon: Target },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Menu des opérations quotidiennes */}
                <NavMain items={mainNavItems} />
                
                {/* Séparateur visuel pour le Paramétrage Métier */}
                <div className="mt-8 mb-4">
                    <div className="px-6 text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase mb-2">
                        Administration
                    </div>
                    <NavMain items={configNavItems} />
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
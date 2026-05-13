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
    Component
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

// Importation de toutes tes routes générées (Assure-toi que route.ts est à jour)
import { 
    dashboard, 
    sitesIndex, 
    unitsIndex, 
    categoriesIndex, 
    generationsIndex, 
    dailyProductionsIndex,
    feedConsumptionsIndex,
    flockMortalitiesIndex,
    flockCullingsIndex,
    flockWeighingsIndex,
    healthTreatmentsIndex,
    breedStandardsIndex,
    customersIndex,
    saleOrdersIndex,
    deliveryNotesIndex,
    productDonationsIndex,
    scheduledTreatmentsIndex, // NOUVEAU
    speciesIndex,             // NOUVEAU
    breedsIndex,              // NOUVEAU
    prophylaxisProgramsIndex  // NOUVEAU
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
        title: 'Zootechnie (Élevage)',
        icon: Bird,
        href: '#',
        children: [
            { title: 'Lots & Générations', href: generationsIndex(), icon: Layers },
            { title: 'Alimentation', href: feedConsumptionsIndex(), icon: Utensils },
            { title: 'Production d\'Œufs', href: dailyProductionsIndex(), icon: Egg },
            { title: 'Pesée & Croissance', href: flockWeighingsIndex(), icon: Activity },
            { title: 'Santé & Soins', href: healthTreatmentsIndex(), icon: Stethoscope },
            { title: 'Calendrier Sanitaire', href: scheduledTreatmentsIndex(), icon: CalendarCheck }, // CORRIGÉ
            { title: 'Mortalité', href: flockMortalitiesIndex(), icon: Skull },
            { title: 'Réforme & Sorties', href: flockCullingsIndex(), icon: TrendingDown },
        ],
    },
    {
        title: 'Ventes & Commercial',
        icon: ShoppingCart,
        href: '#',
        children: [
            { title: 'Clients', href: customersIndex(), icon: Users },
            { title: 'Commandes', href: saleOrdersIndex(), icon: ShoppingCart },
            { title: 'Bons de livraison', href: deliveryNotesIndex(), icon: FileText },
            { title: 'Dons de produits', href: productDonationsIndex(), icon: Gift },
        ],
    },
    {
        title: 'Stocks & Logistique',
        icon: Package,
        href: '#',
        children: [
            { title: 'Mouvements Stock', href: '#', icon: ArrowRightLeft }, // En attente du contrôleur de stock
            { title: 'État des stocks', href: '#', icon: LayoutGrid }, // En attente du contrôleur de stock
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
            { title: 'Entreprises & Filiales', href: '#', icon: Building2 }, // En attente
            { title: 'Sites & Bâtiments', href: sitesIndex(), icon: MapPin },
            
            // Référentiel Zootechnique
            { title: 'Espèces', href: speciesIndex(), icon: Dna }, // CORRIGÉ
            { title: 'Races / Souches', href: breedsIndex(), icon: Component }, // CORRIGÉ
            { title: 'Standards de Race', href: breedStandardsIndex(), icon: Target },
            { title: 'Prog. Prophylactiques', href: prophylaxisProgramsIndex(), icon: ShieldPlus }, // CORRIGÉ
            
            // Système
            { title: 'Unités de mesure', href: unitsIndex(), icon: Scale },
            { title: 'Catégories & Articles', href: categoriesIndex(), icon: Tags },
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
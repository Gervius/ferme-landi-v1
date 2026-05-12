import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Layers, 
    Bird, 
    Package, 
    ClipboardCheck, 
    Settings2, 
    MapPin,
    Scale,
    Tags,
    Activity
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
import { categoriesIndex, dashboard, sitesIndex, unitsIndex, generationsIndex, dailyProductionsIndex } from '@/routes';
import type { NavItem } from '@/types';

// Regroupement par Domaines Métier
const mainNavItems: NavItem[] = [
    {
        title: 'Tableau de Bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Exploitation',
        icon: MapPin,
        href: '#', // Parent de groupe
        children: [
            { title: 'Sites de production', href: sitesIndex(), icon: MapPin },
            { title: 'Unités de mesure', href: unitsIndex(), icon: Scale },
            { title: 'Catégories articles', href: categoriesIndex(), icon: Tags },
        ],
    },
    {
        title: 'Zootechnie',
        icon: Bird,
        href: '#',
        children: [
            { title: 'Générations (Lots)', href: generationsIndex(), icon: Layers }, // Remplacer par route() dès que prêt
            { title: 'Suivi Quotidien', href: dailyProductionsIndex(), icon: Activity },
            { title: 'Approbations', href: '#', icon: ClipboardCheck },
        ],
    },
    {
        title: 'Stocks & Inventaire',
        icon: Package,
        href: '#',
        children: [
            { title: 'Mouvements Stock', href: '#', icon: Package },
            { title: 'État des stocks', href: '#', icon: LayoutGrid },
        ],
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Configuration',
        href: '#',
        icon: Settings2,
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
                {/* Section Principale : Métier */}
                <NavMain items={mainNavItems} />
                
                {/* Séparation visuelle pour la configuration si nécessaire */}
                <div className="mt-auto">
                    <NavMain items={settingsNavItems} />
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Calendar,
  PartyPopper,
  Dumbbell,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/reservations', label: 'Reservations', icon: UtensilsCrossed },
  { href: '/admin/event-spaces', label: 'Event Spaces', icon: PartyPopper },
  { href: '/admin/event-bookings', label: 'Event Bookings', icon: Calendar },
  { href: '/admin/fitness-plans', label: 'Fitness Plans', icon: Dumbbell },
  { href: '/admin/memberships', label: 'Memberships', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#1A1A1A]">
      <SidebarHeader className="border-b border-white/5 p-6">
        <h2 className="text-xl font-bold text-[#D4AF37]">Admin Panel</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? 'bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90 hover:text-black'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }
                    >
                      <Link href={item.href}>
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

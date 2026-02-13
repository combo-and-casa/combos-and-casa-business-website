'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Dumbbell, 
  Calendar, 
  UtensilsCrossed,
  LogOut,
  User
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole = 'customer' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  const customerLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "All Orders", icon: ShoppingBag },
    { href: "/admin/memberships", label: "All Memberships", icon: Dumbbell },
    { href: "/admin/bookings", label: "Event Bookings", icon: Calendar },
    { href: "/admin/reservations", label: "Reservations", icon: UtensilsCrossed },
    { href: "/admin/users", label: "Users", icon: User },
  ];

  const links = userRole === 'admin' ? adminLinks : customerLinks;

  return (
    <div className="hidden md:flex w-64 bg-[#1A1A1A] border-r border-white/5 min-h-screen flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <h2 className="text-lg font-bold text-[#D4AF37]">
          {userRole === 'admin' ? 'Admin Panel' : 'Dashboard'}
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#D4AF37] text-black font-semibold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

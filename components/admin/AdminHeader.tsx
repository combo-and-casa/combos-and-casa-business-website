'use client';

import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminHeader() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-white/5 bg-[#1A1A1A] px-4 md:px-6">
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden flex items-center gap-2">
        <SidebarTrigger className="text-white" />
        <Separator orientation="vertical" className="h-6 bg-white/10" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/70 hover:text-white hover:bg-white/5"
          suppressHydrationWarning
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#D4AF37]" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5"
              suppressHydrationWarning
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]">
                <User className="h-4 w-4 text-black" />
              </div>
              <span className="hidden md:inline-block max-w-37.5 truncate">
                {userEmail || 'Admin'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border-white/10">
            <DropdownMenuLabel className="text-white">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Admin Account</p>
                <p className="text-xs text-white/60 truncate">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              className="text-white/70 focus:text-white focus:bg-white/5 cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              <User className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

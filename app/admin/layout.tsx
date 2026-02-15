import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

async function checkAdminAccess() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      redirect('/auth/signin?message=Please sign in to continue');
    }

    // Check if user is admin using the database function
    const { data: isAdminData, error: adminError } = await supabase
      .rpc('is_admin');

    if (adminError || !isAdminData) {
      redirect('/?message=Access denied. Admin privileges required.');
    }

    return user;
  } catch {
    // If any error occurs (including session errors), redirect to signin
    redirect('/auth/signin?message=Please sign in to continue');
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  await checkAdminAccess();

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AdminSidebar />
        <SidebarInset className="flex-1 w-full flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-4 md:p-8 w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

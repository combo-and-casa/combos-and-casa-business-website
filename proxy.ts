import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function proxy(request: NextRequest) {
  // Add pathname to headers for conditional rendering
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);
  
  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get user session
  const { data: { session, user } } = await supabase.auth.getSession();

  // Check session age - force re-authentication after 1 day
  if (session && user) {
    const sessionCreatedAt = new Date(session.created_at || 0).getTime();
    const now = Date.now();
    const sessionAge = now - sessionCreatedAt;

    // If session is older than 1 day, sign out and redirect
    if (sessionAge > ONE_DAY_IN_MS) {
      await supabase.auth.signOut();
      
      // Only redirect to signin if on protected routes
      if (
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/dashboard')
      ) {
        return NextResponse.redirect(
          new URL('/auth/signin?message=Your session has expired. Please sign in again.', request.url)
        );
      }
    }
  }

  // Refresh session if expired - this will also update the cookies
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!currentUser) {
      return NextResponse.redirect(new URL('/auth/signin?message=Please sign in to continue', request.url));
    }
    
    // Check if user is admin
    const { data: isAdminData } = await supabase.rpc('is_admin');
    if (!isAdminData) {
      return NextResponse.redirect(new URL('/?message=Access denied. Admin privileges required.', request.url));
    }
  }

  // Protect dashboard route - also ensure admins can't access user dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!currentUser) {
      return NextResponse.redirect(new URL('/auth/signin?message=Please sign in to continue', request.url));
    }
    
    // Check if user is admin - redirect to admin dashboard
    const { data: isAdminData } = await supabase.rpc('is_admin');
    if (isAdminData) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Redirect to appropriate dashboard if already signed in and trying to access auth pages
  if (
    (request.nextUrl.pathname.startsWith('/auth/signin') ||
     request.nextUrl.pathname.startsWith('/auth/signup')) &&
    currentUser
  ) {
    // Check if user is admin
    const { data: isAdminData } = await supabase.rpc('is_admin');
    if (isAdminData) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

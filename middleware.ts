// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request and response cookies
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request and response cookies
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  )

  // Use getUser() for an authenticated session
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect admin dashboard routes
  if (pathname.startsWith('/admin/dashboard')) {
    if (!user) {
      await supabase.auth.signOut(); // Clear any potentially problematic session
      return NextResponse.redirect(new URL('/auth/login?message_key=auth_required&origin=admin_dashboard', request.url));
    }
    if (user.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/login?error_key=not_admin&origin=admin_dashboard_role', request.url));
    }
  }

  // Protect vendor routes (all /vendor/* except auth-related ones)
  if (pathname.startsWith('/vendor/') &&
      !pathname.startsWith('/vendor/login') &&  // Assuming /vendor/login is your vendor login page
      !pathname.startsWith('/vendor/signup')) { // Assuming /vendor/signup for vendor registration
    if (!user) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/login?message_key=auth_required&origin=vendor_area', request.url));
    }
    if (user.app_metadata?.role !== 'vendor') {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/auth/login?error_key=not_vendor&origin=vendor_area_role', request.url));
    }
  }

  // Redirect logged-in users from auth pages
  if (user) {
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) {
      if (user.app_metadata?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (user.app_metadata?.role === 'vendor') {
        return NextResponse.redirect(new URL('/vendor/dashboard', request.url)); // Or vendor specific login
      }
    }
    // Specific redirection for vendor login if they are already logged in as a vendor
    if (user.app_metadata?.role === 'vendor' && pathname.startsWith('/vendor/login')) {
        return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (your public images folder)
     * - api/ (API routes, if you want to exclude them from this specific middleware)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}
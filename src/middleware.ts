import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/student-dashboard',
  '/admin-dashboard',
  '/admin',
  '/progress-tracking',
  '/resource-vault',
  '/community',
  '/program-management',
  '/student-onboarding',
];

// Routes only for unauthenticated users (redirect away if logged in)
const AUTH_ROUTES = ['/sign-up-login'];

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin-dashboard',
  '/admin',
  '/program-management',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Build a response we can mutate cookies on
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Not logged in → redirect to sign-in
  if (isProtected && !user) {
    const redirectUrl = new URL('/sign-up-login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Logged in → redirect away from auth page to appropriate dashboard
  if (isAuthRoute && user) {
    // Fetch role from user_profiles
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role || user.user_metadata?.role || 'student';

    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin-dashboard', request.url));
    } else if (!profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/student-onboarding', request.url));
    } else {
      return NextResponse.redirect(new URL('/student-dashboard', request.url));
    }
  }

  // Logged in but not admin → redirect to student dashboard
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role || user.user_metadata?.role || 'student';
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/student-dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     * - API routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/|api/).*)',
  ],
};

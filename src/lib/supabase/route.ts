import { createServerClient } from '@supabase/ssr';
import { createClient as createServiceClient, type User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type AppRole = 'admin' | 'student' | 'guest';

async function createRouteClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Route handlers may not always be able to persist refreshed cookies.
          }
        },
      },
    }
  );
}

export function createServiceRoleClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function resolveUserRole(user: User): Promise<AppRole> {
  const supabase = await createRouteClient();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  return (profile?.role || user.user_metadata?.role || 'guest') as AppRole;
}

export async function getRouteAuthContext() {
  const supabase = await createRouteClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      user: null,
      role: 'guest' as AppRole,
    };
  }

  return {
    supabase,
    user,
    role: await resolveUserRole(user),
  };
}

export async function requireAuthenticatedUser() {
  const ctx = await getRouteAuthContext();

  if (!ctx.user) {
    return {
      ...ctx,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return {
    ...ctx,
    error: null,
  };
}

export async function requireAdminUser() {
  const ctx = await requireAuthenticatedUser();

  if (ctx.error) {
    return ctx;
  }

  if (ctx.role !== 'admin') {
    return {
      ...ctx,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return {
    ...ctx,
    error: null,
  };
}

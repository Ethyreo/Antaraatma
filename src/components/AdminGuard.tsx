'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Client-side guard for admin pages.
 * Middleware handles the primary protection; this is a secondary layer.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/sign-up-login');
      return;
    }

    const supabase = createClient();
    supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const role = data?.role || user.user_metadata?.role || 'student';
        if (role !== 'admin') {
          router.replace('/student-dashboard');
        } else {
          setAuthorized(true);
        }
      });
  }, [user, loading, router]);

  if (loading || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F4EFE6' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#1A6B6B', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-sans text-stone-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

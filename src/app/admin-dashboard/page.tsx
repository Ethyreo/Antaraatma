'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboardContent from './components/AdminDashboardContent';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [roleChecked, setRoleChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router?.replace('/sign-up-login');
      return;
    }

    // Verify admin role
    const supabase = createClient();
    supabase?.from('user_profiles')?.select('role')?.eq('id', user?.id)?.maybeSingle()?.then(({ data }) => {
        const role = data?.role || user?.user_metadata?.role || 'student';
        if (role !== 'admin') {
          router?.replace('/student-dashboard');
        } else {
          setIsAdmin(true);
        }
        setRoleChecked(true);
      });
  }, [user, loading, router]);

  if (loading || !roleChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#2A3434' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#1A6B6B', borderTopColor: 'transparent' }} />
          <p className="text-sm font-sans text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen" style={{ background: '#2A3434' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminDashboardContent />
      </div>
    </div>
  );
}
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StudentSidebar from '@/components/StudentSidebar';
import EnhancedStudentDashboard from './components/EnhancedStudentDashboard';

export default function StudentDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router?.replace('/sign-up-login?redirectTo=/student-dashboard');
    }
  }, [user, loading, router]);

  // Show nothing until auth state is resolved — prevents any flash of dashboard content
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F4EFE6' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#1A6B6B', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-sans text-stone-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F4EFE6' }}>
      <StudentSidebar />
      <div className="flex-1 min-w-0">
        <EnhancedStudentDashboard />
      </div>
    </div>
  );
}
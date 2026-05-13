'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import OnboardingTour from './components/OnboardingTour';

export default function StudentOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase?.auth?.getUser();
      if (!user) {
        router?.push('/sign-up-login');
        return;
      }
      setUser(user);

      // Fetch profile
      const { data: profileData } = await supabase?.from('user_profiles')?.select('*')?.eq('id', user?.id)?.single();

      if (profileData?.onboarding_completed) {
        router?.push('/student-dashboard');
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-amber-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Header */}
      <div className="border-b border-stone-200/60 bg-white/80 backdrop-blur-sm px-4 sm:px-6 h-14 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-amber-700 flex items-center justify-center">
            <span className="font-serif text-amber-100 text-xs">V</span>
          </div>
          <span className="font-serif text-base text-stone-800 tracking-tight">VijayHeals</span>
        </div>
        <div className="ml-auto">
          <span className="text-xs font-sans text-stone-400">Welcome, {profile?.full_name || user?.email}</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-10 sm:py-16">
        <div className="text-center mb-8">
          <p className="text-xs font-sans font-medium text-amber-700 uppercase tracking-widest mb-2">Getting Started</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-stone-800 mb-2">
            Welcome to your healing journey
          </h1>
          <p className="text-sm font-sans text-stone-500 max-w-md mx-auto">
            Let us show you around before you dive in.
          </p>
        </div>
        <OnboardingTour
          userId={user?.id || ''}
          userName={profile?.full_name || user?.email || ''}
        />
      </div>
    </div>
  );
}

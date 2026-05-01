'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentTopbar() {
  const [showLogout, setShowLogout] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [initials, setInitials] = useState('');
  const router = useRouter();
  const { user, getUserProfile, signOut } = useAuth();

  useEffect(() => {
    const fetchName = async () => {
      if (!user) return;
      try {
        const profile = await getUserProfile();
        const name = profile?.full_name || user?.user_metadata?.full_name || user?.email || '';
        setDisplayName(name);
        setInitials(name ? name.charAt(0).toUpperCase() : '?');
      } catch {
        const fallback = user?.user_metadata?.full_name || user?.email || '';
        setDisplayName(fallback);
        setInitials(fallback ? fallback.charAt(0).toUpperCase() : '?');
      }
    };
    fetchName();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
    }
    router?.push('/sign-up-login');
  };

  return (
    <header
      className="sticky top-0 z-40 h-16 flex items-center px-6 xl:px-8 gap-4"
      style={{ background: '#F4EFE6', borderBottom: '1px solid rgba(168,216,206,0.4)' }}
    >
      <div className="flex-1">
        <div>
          <p className="text-xs font-sans" style={{ color: 'rgba(36,44,44,0.45)', fontWeight: 400 }}>Good morning,</p>
          <p className="font-serif text-lg leading-tight" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>{displayName || 'Loading...'}</p>
        </div>
      </div>

      <div
        className="hidden md:flex items-center gap-2 rounded-sm px-3 py-2 w-52 xl:w-64"
        style={{ background: 'rgba(168,216,206,0.15)', border: '1px solid rgba(168,216,206,0.4)' }}
      >
        <Search size={13} className="shrink-0" style={{ color: 'rgba(26,107,107,0.4)' }} />
        <input
          type="text"
          placeholder="Search lessons, resources..."
          className="bg-transparent text-xs font-sans outline-none flex-1"
          style={{ color: '#242C2C' }}
        />
      </div>

      <button
        className="relative p-2 rounded-sm transition-colors"
        style={{ color: 'rgba(26,107,107,0.5)' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#1A6B6B')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,107,107,0.5)')}
      >
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#C4A052' }} />
      </button>

      <div className="relative flex items-center gap-2.5">
        <button
          onClick={() => setShowLogout(!showLogout)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(26,107,107,0.12)' }}>
            <span className="font-serif text-sm" style={{ color: '#1A6B6B', fontWeight: 400 }}>{initials}</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-sans" style={{ color: '#242C2C', fontWeight: 500 }}>{displayName || 'Loading...'}</p>
            <p className="text-2xs font-sans" style={{ color: 'rgba(36,44,44,0.45)', fontWeight: 400 }}>Foundation Course</p>
          </div>
        </button>

        {showLogout && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-sm shadow-card-hover z-50" style={{ border: '1px solid rgba(168,216,206,0.5)' }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-sans transition-colors"
              style={{ color: 'rgba(36,44,44,0.6)', fontWeight: 400 }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(196,160,82,0.08)';
                (e.currentTarget as HTMLElement).style.color = '#C4A052';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'rgba(36,44,44,0.6)';
              }}
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
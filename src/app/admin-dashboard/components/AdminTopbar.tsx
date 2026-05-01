'use client';
import React, { useState } from 'react';
import { Bell, Settings, RefreshCw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminTopbar() {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router?.push('/sign-up-login');
  };

  return (
    <header
      className="sticky top-0 z-40 h-16 flex items-center px-6 xl:px-8 gap-4"
      style={{ background: '#F4EFE6', borderBottom: '1px solid rgba(168,216,206,0.4)' }}
    >
      <div className="flex-1">
        <p className="text-xs font-sans uppercase tracking-[0.12em]" style={{ color: '#3A7A5A', fontWeight: 600 }}>Admin Dashboard</p>
        <p className="font-serif text-lg leading-tight" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>Control Panel</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-sm transition-all"
          style={{ color: 'rgba(26,107,107,0.5)', border: '1px solid rgba(168,216,206,0.4)', fontWeight: 400 }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#1A6B6B';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,107,107,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(26,107,107,0.5)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,216,206,0.4)';
          }}
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={12} />
          Refresh
        </button>

        <button
          className="relative p-2 rounded-sm transition-colors"
          style={{ color: 'rgba(26,107,107,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A6B6B')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,107,107,0.5)')}
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#C4A052' }} />
        </button>

        <button
          className="p-2 rounded-sm transition-colors"
          style={{ color: 'rgba(26,107,107,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1A6B6B')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(26,107,107,0.5)')}
        >
          <Settings size={18} />
        </button>

        <div className="relative flex items-center gap-2.5 ml-2 pl-3" style={{ borderLeft: '1px solid rgba(168,216,206,0.4)' }}>
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(26,107,107,0.12)' }}>
              <span className="font-serif text-sm" style={{ color: '#1A6B6B', fontWeight: 400 }}>
                {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-sans" style={{ color: '#242C2C', fontWeight: 500 }}>
                {user?.user_metadata?.full_name || 'Administrator'}
              </p>
              <p className="text-2xs font-sans" style={{ color: 'rgba(36,44,44,0.45)', fontWeight: 400 }}>Administrator</p>
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
      </div>
    </header>
  );
}
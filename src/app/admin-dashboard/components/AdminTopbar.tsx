'use client';
import React, { useState } from 'react';
import { Bell, Settings, RefreshCw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminTopbar() {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    router?.push('/sign-up-login');
  };

  return (
    <header
      className="sticky top-0 z-40 h-16 flex items-center px-6 xl:px-8 gap-4"
      style={{ background: '#242C2C', borderBottom: '1px solid rgba(168,216,206,0.12)' }}
    >
      <div className="flex-1">
        <p className="font-serif text-lg" style={{ color: '#A8D8CE', fontWeight: 300, letterSpacing: '0.04em' }}>Admin Dashboard</p>
        <p className="text-xs font-sans" style={{ color: 'rgba(168,216,206,0.35)', fontWeight: 400 }}>Last updated: 05 Apr 2026, 3:48 PM</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-sm transition-all"
          style={{ color: 'rgba(168,216,206,0.5)', border: '1px solid rgba(168,216,206,0.15)', fontWeight: 400 }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#A8D8CE';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,216,206,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(168,216,206,0.5)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,216,206,0.15)';
          }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>

        <button
          className="relative p-2 rounded-sm transition-colors"
          style={{ color: 'rgba(168,216,206,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#A8D8CE')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168,216,206,0.5)')}
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#C4A052' }} />
        </button>

        <button
          className="p-2 rounded-sm transition-colors"
          style={{ color: 'rgba(168,216,206,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#A8D8CE')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168,216,206,0.5)')}
        >
          <Settings size={18} />
        </button>

        <div className="relative flex items-center gap-2.5 ml-2 pl-3" style={{ borderLeft: '1px solid rgba(168,216,206,0.12)' }}>
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(26,107,107,0.3)' }}>
              <span className="font-serif text-sm" style={{ color: '#5FBDBD', fontWeight: 400 }}>V</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-sans" style={{ color: '#A8D8CE', fontWeight: 500 }}>Dr. Vijay Singla</p>
              <p className="text-2xs font-sans" style={{ color: 'rgba(168,216,206,0.35)', fontWeight: 400 }}>Administrator</p>
            </div>
          </button>

          {showLogout && (
            <div className="absolute right-0 top-full mt-2 w-40 rounded-sm shadow-modal z-50" style={{ background: '#2E3838', border: '1px solid rgba(168,216,206,0.15)' }}>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-sans transition-colors"
                style={{ color: 'rgba(168,216,206,0.6)', fontWeight: 400 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(196,160,82,0.1)';
                  (e.currentTarget as HTMLElement).style.color = '#C4A052';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(168,216,206,0.6)';
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
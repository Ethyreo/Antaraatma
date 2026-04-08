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
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 h-16 flex items-center px-6 xl:px-8 gap-4">
      <div className="flex-1">
        <p className="font-serif text-lg text-stone-900">Admin Dashboard</p>
        <p className="text-xs font-sans text-stone-500">Last updated: 05 Apr 2026, 3:48 PM</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 text-xs font-sans font-500 text-stone-500 hover:text-stone-700 border border-stone-200 px-3 py-1.5 rounded-sm hover:bg-stone-50 transition-all">
          <RefreshCw size={12} />
          Refresh
        </button>
        <button className="relative p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-sm transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <button className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-sm transition-colors">
          <Settings size={18} />
        </button>
        <div className="relative flex items-center gap-2.5 ml-2 pl-3 border-l border-stone-200">
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center">
              <span className="font-serif text-sm text-amber-100">V</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-sans font-500 text-stone-800">Dr. Vijay Singla</p>
              <p className="text-2xs font-sans text-stone-500">Administrator</p>
            </div>
          </button>

          {showLogout && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-stone-200 rounded-sm shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-sans text-stone-600 hover:bg-stone-50 hover:text-red-600 transition-colors"
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
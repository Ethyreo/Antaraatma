'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, BookOpen, Award, ChevronLeft, ChevronRight, TrendingUp, Package, Home, MessageSquare, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { label: 'Dashboard', href: '/student-dashboard', icon: LayoutDashboard },
  { label: 'My Progress', href: '/progress-tracking', icon: TrendingUp },
  { label: 'Resource Vault', href: '/resource-vault', icon: BookOpen },
  { label: 'Community', href: '/community', icon: MessageSquare },
  { label: 'Certificates', href: '/student-dashboard', icon: Award },
  { label: 'Shipments', href: '/student-dashboard', icon: Package },
  { label: 'Go to Home', href: '/homepage', icon: Home },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      router?.push('/sign-up-login');
    }
  };

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col transition-all duration-300 shrink-0 ${collapsed ? 'w-16' : 'w-56'}`}
      style={{ background: '#F4EFE6', borderRight: '1px solid rgba(168,216,206,0.4)' }}
    >
      <div
        className={`flex items-center gap-2.5 px-4 h-16 ${collapsed ? 'justify-center' : ''}`}
        style={{ borderBottom: '1px solid rgba(168,216,206,0.4)' }}
      >
        <AppLogo size={28} />
        {!collapsed && (
          <span className="font-serif text-sm tracking-[0.08em]" style={{ color: '#1A6B6B', fontWeight: 300 }}>
            ANTARAATMA
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems?.map((item) => {
          const isActive = pathname === item?.href;
          return (
            <Link
              key={`${item?.href}-${item?.label}`}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
              style={isActive ? {
                background: 'rgba(26,107,107,0.1)',
                color: '#1A6B6B',
                borderLeft: '2px solid #1A6B6B',
                fontWeight: 500,
              } : {
                color: '#3A4A4A',
                fontWeight: 400,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(168,216,206,0.2)';
                  (e.currentTarget as HTMLElement).style.color = '#1A6B6B';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#3A4A4A';
                }
              }}
            >
              <item.icon size={16} className="shrink-0" />
              {!collapsed && <span>{item?.label}</span>}
            </Link>
          );
        })}

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          title={collapsed ? 'Sign Out' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-all duration-150 w-full ${collapsed ? 'justify-center' : ''}`}
          style={{ color: '#3A4A4A', fontWeight: 400 }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(196,160,82,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#C4A052';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#3A4A4A';
          }}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </nav>

      <div className="px-2 pb-4 pt-3" style={{ borderTop: '1px solid rgba(168,216,206,0.4)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-all w-full ${collapsed ? 'justify-center' : ''}`}
          style={{ color: 'rgba(58,74,74,0.5)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#1A6B6B';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(58,74,74,0.5)';
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
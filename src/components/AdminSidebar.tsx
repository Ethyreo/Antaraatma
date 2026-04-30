'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, BookOpen, Users, FileText, ShoppingCart, Star, HelpCircle, MessageSquare, Bell, Package, Settings, ChevronLeft, ChevronRight, Layers, Globe, TrendingUp, LogOut, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/leads', icon: TrendingUp },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Services', href: '/admin/services', icon: Globe },
  { label: 'Programs', href: '/program-management', icon: Layers },
  { label: 'Resources', href: '/admin/resources', icon: BookOpen },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { label: 'Community', href: '/admin/community', icon: MessageSquare },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Announcements', href: '/admin/announcements', icon: Bell },
  { label: 'Shipments', href: '/admin/shipments', icon: Package },
  { label: 'Site Content', href: '/admin/site-content', icon: Settings },
  { label: 'Go to Home', href: '/homepage', icon: Home },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    router?.push('/sign-up-login');
  };

  return (
    <aside
      className={`sticky top-0 h-screen flex flex-col transition-all duration-300 shrink-0 ${collapsed ? 'w-16' : 'w-56'}`}
      style={{ background: '#242C2C', borderRight: '1px solid rgba(168,216,206,0.12)' }}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 px-4 h-16 ${collapsed ? 'justify-center' : ''}`}
        style={{ borderBottom: '1px solid rgba(168,216,206,0.12)' }}
      >
        <AppLogo size={28} />
        {!collapsed && (
          <span className="font-serif text-sm tracking-[0.08em]" style={{ color: '#A8D8CE', fontWeight: 300 }}>
            ANTARAATMA
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems?.map((item) => {
          const isActive = pathname === item?.href || pathname?.startsWith(item?.href + '/');
          return (
            <Link
              key={item?.href}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
              style={isActive ? {
                background: 'rgba(26,107,107,0.25)',
                color: '#5FBDBD',
                borderLeft: '2px solid #1A6B6B',
              } : {
                color: 'rgba(168,216,206,0.55)',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(168,216,206,0.08)';
                  (e.currentTarget as HTMLElement).style.color = '#A8D8CE';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(168,216,206,0.55)';
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
          style={{ color: 'rgba(168,216,206,0.4)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(196,160,82,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#C4A052';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'rgba(168,216,206,0.4)';
          }}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-4 pt-3" style={{ borderTop: '1px solid rgba(168,216,206,0.1)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-all w-full ${collapsed ? 'justify-center' : ''}`}
          style={{ color: 'rgba(168,216,206,0.3)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#A8D8CE';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(168,216,206,0.3)';
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
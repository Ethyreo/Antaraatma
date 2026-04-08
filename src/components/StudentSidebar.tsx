'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, BookOpen, Award, ChevronLeft, ChevronRight, TrendingUp, Package, Home, MessageSquare, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/student-dashboard', icon: LayoutDashboard },
  { label: 'My Progress', href: '/progress-tracking', icon: TrendingUp },
  { label: 'Resource Vault', href: '/resource-vault', icon: BookOpen },
  { label: 'Community', href: '/community', icon: MessageSquare },
  { label: 'Certificates', href: '/student-dashboard', icon: Award },
  { label: 'Shipments', href: '/student-dashboard', icon: Package },
  { label: 'Back to Site', href: '/homepage', icon: Home },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    router?.push('/sign-up-login');
  };

  return (
    <aside className={`sticky top-0 h-screen flex flex-col bg-[#FAF8F4] border-r border-stone-200/60 transition-all duration-300 shrink-0 ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className={`flex items-center gap-2.5 px-4 h-16 border-b border-stone-200/60 ${collapsed ? 'justify-center' : ''}`}>
        <AppLogo size={28} />
        {!collapsed && <span className="font-serif text-base text-stone-800 tracking-tight">VijayHeals</span>}
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems?.map((item) => {
          const isActive = pathname === item?.href;
          return (
            <Link
              key={`${item?.href}-${item?.label}`}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-all duration-150 ${
                isActive
                  ? 'bg-amber-50 text-amber-900 border-l-2 border-amber-700' :'text-stone-600 hover:bg-amber-50/50 hover:text-amber-900'
              } ${collapsed ? 'justify-center' : ''}`}
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
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans text-stone-600 hover:bg-amber-50/50 hover:text-red-600 transition-all duration-150 w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </nav>
      <div className="px-2 pb-4 border-t border-stone-200/60 pt-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
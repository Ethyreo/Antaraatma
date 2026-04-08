'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, BookOpen, Users, FileText, ShoppingCart, Star, HelpCircle, MessageSquare, Bell, Package, Settings, ChevronLeft, ChevronRight, Layers, Globe, TrendingUp } from 'lucide-react';

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
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sticky top-0 h-screen flex flex-col bg-stone-900 border-r border-stone-800 transition-all duration-300 shrink-0 ${collapsed ? 'w-16' : 'w-56'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-16 border-b border-stone-800 ${collapsed ? 'justify-center' : ''}`}>
        <AppLogo size={28} />
        {!collapsed && <span className="font-serif text-base text-stone-200 tracking-tight">VijayHeals</span>}
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans transition-all duration-150 ${
                isActive
                  ? 'bg-amber-900/30 text-amber-400 border-l-2 border-amber-600' :'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={16} className="shrink-0" />
              {!collapsed && <span>{item?.label}</span>}
            </Link>
          );
        })}
      </nav>
      {/* Collapse toggle */}
      <div className="px-2 pb-4 border-t border-stone-800 pt-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans text-stone-500 hover:bg-stone-800 hover:text-stone-300 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
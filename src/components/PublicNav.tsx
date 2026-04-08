'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { label: 'Programs', href: '/programs-overview' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Community', href: '/community' },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!user) {
      setUserRole(null);
      setDisplayName(null);
      return;
    }

    // Set display name from user metadata first (fast)
    const metaName = user?.user_metadata?.full_name || user?.email?.split('@')?.[0] || 'Account';
    setDisplayName(metaName);

    // Fetch role from user_profiles
    const supabase = createClient();
    supabase?.from('user_profiles')?.select('role, full_name')?.eq('id', user?.id)?.single()?.then(({ data }) => {
        if (data) {
          setUserRole(data?.role);
          if (data?.full_name) setDisplayName(data?.full_name);
        }
      });
  }, [user]);

  const getDashboardHref = () => {
    if (userRole === 'admin') return '/admin-dashboard';
    return '/student-dashboard';
  };

  const handleLogout = async () => {
    await signOut();
    setMobileOpen(false);
    router?.push('/homepage');
  };

  const isLoggedIn = !loading && !!user;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0e0d0b]/95 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.05)]'
          : 'bg-transparent'
      }`}
    >
      <div className="editorial-container flex items-center justify-between h-18">
        <Link href="/homepage" className="flex items-center gap-2.5 group">
          <AppLogo size={32} />
          <span className={`font-serif text-lg tracking-tight transition-colors ${scrolled ? 'text-stone-200' : 'text-stone-200'} group-hover:text-amber-400`}>
            VijayHeals
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks?.map((link) => (
            <Link
              key={`nav-${link?.label?.toLowerCase()}`}
              href={link?.href}
              className="text-sm font-sans font-medium transition-colors tracking-wide text-stone-400 hover:text-amber-400"
            >
              {link?.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? null : isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardHref()}
                className="flex items-center gap-1.5 text-sm font-sans font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                <User size={15} />
                {displayName}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-sans font-medium text-stone-400 hover:text-amber-400 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/sign-up-login" className="text-sm font-sans font-medium text-stone-400 hover:text-amber-400 transition-colors">
              Sign In
            </Link>
          )}
          <Link
            href="/awareness-session"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-sans tracking-wide transition-all duration-300"
            style={{
              background: 'rgba(180,130,55,0.12)',
              border: '1px solid rgba(180,130,55,0.3)',
              color: '#d4a855',
            }}
          >
            Free Session
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-stone-400 hover:text-amber-400 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} bg-[#0e0d0b] border-t border-white/5`}>
        <div className="editorial-container py-4 flex flex-col gap-1">
          {navLinks?.map((link) => (
            <Link
              key={`mobile-nav-${link?.label?.toLowerCase()}`}
              href={link?.href}
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-sm font-sans font-medium text-stone-400 hover:text-amber-400 transition-colors"
            >
              {link?.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-white/5 flex flex-col gap-2">
            {loading ? null : isLoggedIn ? (
              <>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileOpen(false)}
                  className="py-2.5 text-sm font-sans font-medium text-amber-400 hover:text-amber-300 transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <User size={15} />
                  {displayName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2.5 text-sm font-sans font-medium text-stone-400 hover:text-amber-400 transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/sign-up-login" className="py-2.5 text-sm font-sans font-medium text-stone-400 hover:text-amber-400 transition-colors text-center">Sign In</Link>
            )}
            <Link
              href="/awareness-session"
              className="py-2.5 text-sm font-sans text-center transition-all duration-300"
              style={{
                background: 'rgba(180,130,55,0.12)',
                border: '1px solid rgba(180,130,55,0.3)',
                color: '#d4a855',
              }}
            >
              Free Session
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
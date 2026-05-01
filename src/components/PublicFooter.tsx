'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function PublicFooter() {
  return (
    <footer style={{ background: '#242C2C', color: '#A8D8CE' }}>
      <div className="editorial-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={28} />
              <span className="font-serif text-lg tracking-[0.08em]" style={{ color: '#F4EFE6', fontWeight: 300 }}>
                ANTARAATMA
              </span>
            </div>
            <p className="text-sm font-sans leading-relaxed max-w-reading" style={{ color: 'rgba(168,216,206,0.6)', fontWeight: 400 }}>
              You are not broken. You are becoming. Dr. Vijay Singla guides you through a structured healing pathway — grounded in naturopathy, designed for lasting transformation.
            </p>
            {/* Sacred geometry motif */}
            <div className="mt-6 flex items-center gap-2">
              <div className="w-8 h-px" style={{ background: '#C4A052', opacity: 0.5 }} />
              <span className="text-xs font-sans uppercase tracking-[0.15em]" style={{ color: '#C4A052', opacity: 0.7, fontWeight: 600 }}>
                Heal Within · Rise Higher
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: '#5FBDBD' }}>Programs</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Awareness Session', href: '/awareness-session' },
                { label: 'Foundation Course', href: '/foundation-course' },
                { label: 'Transformation Mastery', href: '/transformation-mastery' },
                { label: 'Programs Overview', href: '/programs-overview' },
              ]?.map((item) => (
                <li key={item?.label}>
                  <Link
                    href={item?.href}
                    className="text-sm font-sans transition-colors"
                    style={{ color: 'rgba(168,216,206,0.55)', fontWeight: 400 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#A8D8CE')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168,216,206,0.55)')}
                  >
                    {item?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: '#5FBDBD' }}>Explore</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Services', href: '/services' },
                { label: 'Blog & Journal', href: '/blog' },
                { label: 'Community', href: '/community' },
                { label: 'Resource Vault', href: '/resource-vault' },
              ]?.map((item) => (
                <li key={item?.label}>
                  <Link
                    href={item?.href}
                    className="text-sm font-sans transition-colors"
                    style={{ color: 'rgba(168,216,206,0.55)', fontWeight: 400 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#A8D8CE')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168,216,206,0.55)')}
                  >
                    {item?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: '#5FBDBD' }}>Contact</p>
            <ul className="space-y-2.5">
              <li className="text-sm font-sans" style={{ color: 'rgba(168,216,206,0.55)' }}>hello@antaraatma.com</li>
              <li className="text-sm font-sans" style={{ color: 'rgba(168,216,206,0.55)' }}>+91 98765 43210</li>
              <li className="mt-4">
                <Link
                  href="/awareness-session"
                  className="text-sm font-sans transition-colors"
                  style={{ color: '#C4A052', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D4B06A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#C4A052')}
                >
                  Begin your journey →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(168,216,206,0.12)' }}>
          <p className="text-xs font-sans" style={{ color: 'rgba(168,216,206,0.3)' }}>© 2026 Antaraatma · Dr. Vijay Singla. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs font-sans transition-colors" style={{ color: 'rgba(168,216,206,0.3)' }}>Privacy Policy</Link>
            <Link href="#" className="text-xs font-sans transition-colors" style={{ color: 'rgba(168,216,206,0.3)' }}>Terms of Service</Link>
            <Link href="#" className="text-xs font-sans transition-colors" style={{ color: 'rgba(168,216,206,0.3)' }}>Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
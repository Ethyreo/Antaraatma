import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function PublicFooter() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="editorial-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={28} />
              <span className="font-serif text-lg text-stone-200 tracking-tight">VijayHeals</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-500 max-w-reading">
              Guiding seekers through a structured naturopathy healing pathway — from awareness to lasting transformation.
            </p>
          </div>

          <div>
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-stone-500 mb-4">Programs</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Awareness Session', href: '/awareness-session' },
                { label: 'Foundation Course', href: '/foundation-course' },
                { label: 'Transformation Mastery', href: '/transformation-mastery' },
                { label: 'Programs Overview', href: '/programs-overview' },
              ]?.map((item) => (
                <li key={item?.label}>
                  <Link href={item?.href} className="text-sm text-stone-500 hover:text-amber-400 transition-colors">{item?.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-stone-500 mb-4">Explore</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Services', href: '/services' },
                { label: 'Blog & Journal', href: '/blog' },
                { label: 'Community', href: '/community' },
                { label: 'Resource Vault', href: '/resource-vault' },
              ]?.map((item) => (
                <li key={item?.label}>
                  <Link href={item?.href} className="text-sm text-stone-500 hover:text-amber-400 transition-colors">{item?.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-stone-500 mb-4">Contact</p>
            <ul className="space-y-2.5">
              <li className="text-sm text-stone-500">hello@vijayheals.com</li>
              <li className="text-sm text-stone-500">+91 98765 43210</li>
              <li className="mt-4">
                <Link href="/awareness-session" className="text-sm text-amber-500 hover:text-amber-400 transition-colors font-sans font-medium">
                  Join Free Session →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">© 2026 VijayHeals. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
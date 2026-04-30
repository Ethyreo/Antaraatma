'use client';
import React from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { getPublishedServices } from '@/lib/data/mockData';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = getPublishedServices();
  const featured = services?.filter(s => s?.featured);
  const rest = services?.filter(s => !s?.featured);

  return (
    <main style={{ background: '#F4EFE6' }} className="min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-20" style={{ background: '#F4EFE6' }}>
        <div className="editorial-container">
          {/* Sacred geometry accent */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ background: '#1A6B6B', opacity: 0.4 }} />
            <span className="section-label">Services</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="font-serif text-display-lg text-balance leading-[1.08] mb-8" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>
              Healing, guided.<br />
              <span style={{ color: 'rgba(26,107,107,0.35)' }}>In every form it takes.</span>
            </h1>
            <p className="text-lg font-sans font-light leading-relaxed max-w-prose text-balance" style={{ color: 'rgba(36,44,44,0.55)', fontWeight: 300 }}>
              Beyond the structured programs, Dr. Vijay Singla offers a range of personalised and group healing services — each designed to meet you where you are on your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {featured?.length > 0 && (
        <section className="py-16" style={{ background: '#D4EDE8', borderTop: '1px solid rgba(26,107,107,0.1)', borderBottom: '1px solid rgba(26,107,107,0.1)' }}>
          <div className="editorial-container">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px" style={{ background: '#1A6B6B', opacity: 0.4 }} />
              <span className="section-label">Featured Services</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured?.map((service) => (
                <div key={service?.id} className="bg-white rounded-sm p-10 flex flex-col" style={{ border: '1px solid rgba(168,216,206,0.5)' }}>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl mb-4" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>{service?.title}</h2>
                    <p className="text-base font-sans font-light leading-relaxed mb-6" style={{ color: 'rgba(36,44,44,0.55)', fontWeight: 300 }}>{service?.description}</p>
                  </div>
                  <div className="pt-6" style={{ borderTop: '1px solid rgba(168,216,206,0.4)' }}>
                    <Link href={service?.ctaHref} className="btn-primary">
                      {service?.ctaLabel}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Services */}
      {rest?.length > 0 && (
        <section className="py-20" style={{ background: '#F4EFE6' }}>
          <div className="editorial-container">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px" style={{ background: '#1A6B6B', opacity: 0.4 }} />
              <span className="section-label">All Services</span>
            </div>
            <div className="space-y-4">
              {rest?.map((service) => (
                <div key={service?.id} className="bg-white rounded-sm p-8" style={{ border: '1px solid rgba(168,216,206,0.5)' }}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8">
                      <h3 className="font-serif text-xl mb-3" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>{service?.title}</h3>
                      <p className="text-sm font-sans font-light leading-relaxed" style={{ color: 'rgba(36,44,44,0.5)', fontWeight: 300 }}>{service?.description}</p>
                    </div>
                    <div className="lg:col-span-4 flex justify-start lg:justify-end items-start">
                      <Link href={service?.ctaHref} className="btn-ghost text-sm">
                        {service?.ctaLabel} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — Dark Teal (Style 01) */}
      <section className="py-20" style={{ background: '#1A6B6B' }}>
        <div className="editorial-container text-center">
          {/* Sacred Gold rule */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-12 h-px" style={{ background: '#C4A052', opacity: 0.6 }} />
            <span className="text-xs font-sans uppercase tracking-[0.2em]" style={{ color: '#C4A052', opacity: 0.8, fontWeight: 600 }}>
              Begin Your Journey
            </span>
            <div className="w-12 h-px" style={{ background: '#C4A052', opacity: 0.6 }} />
          </div>
          <h2 className="font-serif text-display-md text-balance leading-[1.1] mb-6" style={{ color: '#F4EFE6', fontWeight: 300, letterSpacing: '0.04em' }}>
            Not sure where to begin?
          </h2>
          <p className="text-base font-sans font-light max-w-prose mx-auto mb-10" style={{ color: 'rgba(244,239,230,0.6)', fontWeight: 300 }}>
            Start with the free Awareness Session. One hour with Dr. Vijay Singla will give you the clarity to choose the right path.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/awareness-session"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-sans tracking-wide rounded-sm transition-all duration-300"
              style={{ background: '#F4EFE6', color: '#1A6B6B', fontWeight: 600 }}
              onMouseEnter={e => (e.currentTarget.style.background = '#D4EDE8')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F4EFE6')}
            >
              Join the Free Session
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/programs-overview"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-sans tracking-wide rounded-sm transition-all duration-300"
              style={{ border: '1px solid rgba(244,239,230,0.3)', color: 'rgba(244,239,230,0.7)', fontWeight: 400 }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,239,230,0.6)';
                (e.currentTarget as HTMLElement).style.color = '#F4EFE6';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,239,230,0.3)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(244,239,230,0.7)';
              }}
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

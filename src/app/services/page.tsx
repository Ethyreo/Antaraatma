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
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Services</span>
            </div>
            <h1 className="font-serif text-display-lg text-stone-900 text-balance leading-[1.08] mb-8">
              Healing, guided.<br />
              <span className="text-stone-500">In every form it takes.</span>
            </h1>
            <p className="text-lg font-sans font-light text-stone-500 leading-relaxed max-w-prose text-balance">
              Beyond the structured programs, Dr. Vijay Singla offers a range of personalised and group healing services — each designed to meet you where you are.
            </p>
          </div>
        </div>
      </section>
      {/* Featured Services */}
      {featured?.length > 0 && (
        <section className="py-16 bg-stone-50 border-y border-stone-200/60">
          <div className="editorial-container">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Featured Services</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured?.map((service) => (
                <div key={service?.id} className="bg-white border border-stone-200/80 rounded-sm p-10 flex flex-col">
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl text-stone-900 mb-4">{service?.title}</h2>
                    <p className="text-base font-sans font-light text-stone-500 leading-relaxed mb-6">{service?.description}</p>
                  </div>
                  <div className="pt-6 border-t border-stone-100">
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
        <section className="py-20 bg-[#FAF8F4]">
          <div className="editorial-container">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">All Services</span>
            </div>
            <div className="space-y-4">
              {rest?.map((service) => (
                <div key={service?.id} className="bg-white border border-stone-200/80 rounded-sm p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8">
                      <h3 className="font-serif text-xl text-stone-800 mb-3">{service?.title}</h3>
                      <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">{service?.description}</p>
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
      {/* CTA */}
      <section className="py-20 bg-stone-900">
        <div className="editorial-container text-center">
          <h2 className="font-serif text-display-md text-stone-100 text-balance leading-[1.1] mb-6">
            Not sure where to begin?
          </h2>
          <p className="text-base font-sans font-light text-stone-400 max-w-prose mx-auto mb-10">
            Start with the free Awareness Session. One hour with Dr. Vijay Singla will give you the clarity to choose the right path.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/awareness-session" className="btn-primary text-base px-8 py-4">
              Join the Free Session
              <ArrowRight size={16} />
            </Link>
            <Link href="/programs-overview" className="btn-ghost text-base px-8 py-4 border-stone-700 text-stone-300 hover:bg-stone-800">
              Explore Programs
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

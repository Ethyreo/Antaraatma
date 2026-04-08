import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-18 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,168,76,0.06)_0%,transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(122,140,110,0.05)_0%,transparent_50%)]" />
      <div className="editorial-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center min-h-[calc(100vh-4.5rem)] py-24">
          {/* Left: Text */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-px bg-amber-700/40" />
              <span className="section-label">Naturopathy Healing Platform</span>
            </div>

            <h1 className="font-serif text-display-xl text-stone-900 text-balance mb-8 leading-[1.05]">
              Heal from within.
              <br />
              <em className="text-amber-800/80 not-italic">Naturally.</em>
            </h1>

            <p className="text-lg font-sans font-300 text-stone-600 leading-relaxed max-w-prose mb-10 text-balance">
              Dr. Vijay Singla guides you through a structured healing pathway — grounded in naturopathy, designed for lasting transformation, and built around your body&apos;s innate intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/sign-up-login" className="btn-primary">
                Begin Your Journey
                <ArrowRight size={15} />
              </Link>
              <Link href="/programs-overview" className="btn-ghost">
                <Play size={14} className="text-amber-700" />
                Explore Programs
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="mt-14 pt-8 border-t border-stone-200/60 grid grid-cols-3 gap-6">
              {[
                { value: '2,400+', label: 'Students Healed' },
                { value: '94%', label: 'Completion Rate' },
                { value: '12 yrs', label: 'Clinical Practice' },
              ]?.map((stat) => (
                <div key={`hero-stat-${stat?.label?.toLowerCase()?.replace(/\s/g, '-')}`}>
                  <p className="font-serif text-2xl text-stone-900 tabular-nums">{stat?.value}</p>
                  <p className="text-xs font-sans font-500 text-stone-500 mt-0.5 tracking-wide">{stat?.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg xl:max-w-xl">
              {/* Main image placeholder — editorial portrait */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-amber-50 via-stone-100 to-stone-200 rounded-sm overflow-hidden shadow-card">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-amber-100 border-2 border-amber-200 mx-auto mb-4 flex items-center justify-center">
                      <span className="font-serif text-3xl text-amber-800">V</span>
                    </div>
                    <p className="font-serif text-lg text-stone-700">Dr. Vijay Singla</p>
                    <p className="text-xs font-sans text-stone-500 mt-1">Naturopath & Healing Guide</p>
                  </div>
                </div>
                {/* Decorative overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-stone-900/20 to-transparent" />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-stone-200 rounded-sm px-5 py-4 shadow-card-hover">
                <p className="text-xs font-sans font-500 text-stone-500 mb-1 uppercase tracking-wide">Next Session</p>
                <p className="font-serif text-sm text-stone-800">Awareness Session</p>
                <p className="text-xs font-sans text-amber-700 mt-1 font-500">12 Apr 2026 · Online</p>
              </div>

              {/* Decorative dot grid */}
              <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(circle, #92400e 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-8 bg-stone-400 animate-pulse-soft" />
        <span className="text-2xs font-sans tracking-[0.15em] text-stone-500 uppercase">Scroll</span>
      </div>
    </section>
  );
}
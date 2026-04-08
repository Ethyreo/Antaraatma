import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const pillars = [
  {
    id: 'pillar-root-cause',
    number: '01',
    title: 'Root Cause Healing',
    body: 'We do not suppress symptoms. We trace illness to its origin — in nutrition, lifestyle, environment, and thought — and address it there.',
  },
  {
    id: 'pillar-body-intelligence',
    number: '02',
    title: 'Body Intelligence',
    body: 'The human body carries a precise healing intelligence. Our programs teach you to listen to it, trust it, and work with it — not against it.',
  },
  {
    id: 'pillar-structured-path',
    number: '03',
    title: 'Structured Transformation',
    body: 'Healing is not linear, but it is learnable. Our three-stage pathway gives you a clear map, measurable milestones, and expert guidance at every step.',
  },
];

export default function PhilosophyTeaser() {
  return (
    <section id="philosophy" className="py-28 bg-white">
      <div className="editorial-container">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-px bg-amber-700/40" />
              <span className="section-label">Healing Philosophy</span>
            </div>
            <h2 className="font-serif text-display-lg text-stone-900 text-balance">
              A different way to think about health
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-base font-sans font-300 text-stone-600 leading-relaxed max-w-prose text-balance">
              Most healing systems treat the surface. Naturopathy goes deeper — addressing the conditions that allow illness to arise, and cultivating the conditions that allow vitality to flourish.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200">
          {pillars?.map((pillar) => (
            <div key={pillar?.id} className="bg-[#FAF8F4] p-10 xl:p-12 group hover:bg-white transition-colors duration-300">
              <span className="font-serif text-4xl text-amber-800/20 block mb-6">{pillar?.number}</span>
              <h3 className="font-serif text-xl text-stone-900 mb-4">{pillar?.title}</h3>
              <p className="text-sm font-sans font-300 text-stone-600 leading-relaxed">{pillar?.body}</p>
            </div>
          ))}
        </div>

        {/* Link */}
        <div className="mt-12 flex justify-end">
          <Link
            href="/homepage"
            className="flex items-center gap-2 text-sm font-sans font-500 text-amber-800 hover:text-amber-900 transition-colors group"
          >
            Read the full philosophy
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
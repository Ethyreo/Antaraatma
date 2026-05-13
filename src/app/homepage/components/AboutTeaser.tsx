import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutTeaser() {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="editorial-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Image / visual */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-stone-100 to-amber-50 rounded-sm overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-amber-100 border-4 border-white shadow-card mx-auto mb-5 flex items-center justify-center">
                      <span className="font-serif text-5xl text-amber-800">V</span>
                    </div>
                    <p className="font-serif text-xl text-stone-700">Dr. Vijay Singla</p>
                    <p className="text-sm font-sans text-stone-500 mt-1">BNYS · Naturopath</p>
                  </div>
                </div>
              </div>

              {/* Credentials card */}
              <div className="absolute -right-6 bottom-12 bg-white border border-stone-200 rounded-sm px-5 py-4 shadow-card-hover max-w-[200px]">
                <p className="text-xs font-sans font-600 uppercase tracking-wide text-stone-500 mb-2">Credentials</p>
                {['BNYS Graduate', 'Clinical Naturopath', 'Yoga Therapist', '12 yrs practice']?.map((cred) => (
                  <p key={`cred-${cred?.toLowerCase()?.replace(/\s/g, '-')}`} className="text-xs font-sans text-stone-700 py-0.5">
                    {cred}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-px bg-amber-700/40" />
              <span className="section-label">About Dr. Vijay</span>
            </div>

            <h2 className="font-serif text-display-md text-stone-900 text-balance mb-6">
              Twelve years of healing. One unwavering conviction.
            </h2>

            <div className="space-y-4 text-base font-sans font-300 text-stone-600 leading-relaxed">
              <p>
                Dr. Vijay Singla trained as a naturopath and has spent over a decade working with patients across chronic illness, metabolic dysfunction, hormonal imbalance, and mental fatigue — conditions that conventional medicine often treats with suppression rather than resolution.
              </p>
              <p>
                His approach is precise, evidence-informed, and deeply rooted in the body&apos;s natural healing capacity. He built VijayHeals to take that work beyond the clinic — to reach people who need structured guidance but cannot access it in person.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 py-8 border-y border-stone-200">
              {[
                { value: '2,400+', label: 'Patients & Students' },
                { value: '18', label: 'Countries Reached' },
                { value: '94%', label: 'Program Completion' },
                { value: '4.9/5', label: 'Average Rating' },
              ]?.map((stat) => (
                <div key={`about-stat-${stat?.label?.toLowerCase()?.replace(/\s/g, '-')}`}>
                  <p className="font-serif text-2xl text-stone-900 tabular-nums">{stat?.value}</p>
                  <p className="text-xs font-sans font-500 text-stone-500 mt-0.5">{stat?.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/homepage"
              className="mt-8 inline-flex items-center gap-2 text-sm font-sans font-500 text-amber-800 hover:text-amber-900 transition-colors group"
            >
              Read the full story
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
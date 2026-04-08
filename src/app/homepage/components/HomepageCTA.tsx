import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomepageCTA() {
  return (
    <section className="py-28 bg-amber-900">
      <div className="editorial-container">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-sans font-500 uppercase tracking-[0.15em] text-amber-300/70 mb-6 block">
            Begin Here
          </span>
          <h2 className="font-serif text-display-lg text-amber-50 text-balance mb-6">
            Your healing journey starts with a single session
          </h2>
          <p className="text-base font-sans font-300 text-amber-200/70 leading-relaxed mb-12 max-w-prose mx-auto text-balance">
            Book a 90-minute Awareness Session with Dr. Vijay. Understand your body patterns, explore the pathway, and decide with clarity whether to go deeper.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up-login"
              className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 px-8 py-3.5 text-sm font-sans font-500 tracking-wide transition-all duration-200 hover:bg-white active:scale-95 rounded-sm"
            >
              Book Awareness Session
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/programs-overview"
              className="inline-flex items-center gap-2 border border-amber-600/40 text-amber-200 px-8 py-3.5 text-sm font-sans font-500 tracking-wide transition-all duration-200 hover:bg-amber-800 active:scale-95 rounded-sm"
            >
              View All Programs
            </Link>
          </div>
          <p className="mt-8 text-xs font-sans text-amber-700/60">
            ₹499 · 90 minutes · Online · Refundable if not satisfied
          </p>
        </div>
      </div>
    </section>
  );
}
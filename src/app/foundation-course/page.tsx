'use client';
import React, { useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { getProgramById, getModulesByProgram, getFAQsByProgram, mockResources } from '@/lib/data/mockData';
import { ArrowRight, Check, ChevronDown, ChevronUp, Download } from 'lucide-react';

export default function FoundationCoursePage() {
  const program = getProgramById('prog-foundation');
  const modules = getModulesByProgram('prog-foundation');
  const faqs = getFAQsByProgram('prog-foundation');
  const resources = mockResources?.filter(r => r?.programId === 'prog-foundation' && r?.status === 'published');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  if (!program) return null;

  return (
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Stage 2 · Implementation · {program?.duration}</span>
            </div>
            <h1 className="font-serif text-display-lg text-stone-900 text-balance leading-[1.08] mb-8">
              Foundation Course
            </h1>
            <p className="text-xl font-sans font-light text-stone-500 leading-relaxed max-w-prose mb-10 text-balance">
              Understanding is not enough. The Foundation Course moves you from insight to practice — resetting your physical and energetic body in three focused days.
            </p>
            <div className="flex flex-wrap gap-6 mb-10">
              {['3 days · 1 hour/day', '₹999 one-time', 'Lifetime access', 'Certificate included']?.map(item => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={14} className="text-amber-700" />
                  <span className="text-sm font-sans text-stone-600">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/sign-up-login" className="btn-primary text-base px-8 py-4">
                Enroll for ₹999
                <ArrowRight size={16} />
              </a>
              <a href="/awareness-session" className="btn-ghost text-base px-8 py-4">
                Start with Free Session First
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* What This Course Does */}
      <section className="py-20 bg-stone-900">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="text-xs font-sans uppercase tracking-[0.12em] text-amber-600/70">The Implementation Phase</span>
            </div>
            <h2 className="font-serif text-display-md text-stone-100 text-balance leading-[1.1] mb-8">
              Three days to reset the body you live in.
            </h2>
            <p className="text-base font-sans font-light text-stone-400 leading-relaxed mb-6">
              The Foundation Course is built around a single principle: the body cannot heal in the same environment that made it unwell. Before deeper transformation is possible, the physical and energetic body must be reset.
            </p>
            <p className="text-base font-sans font-light text-stone-400 leading-relaxed">
              Over three days — one focused hour each — Dr. Vijay Singla guides you through a systematic reset of your gut, your nervous system, and your energetic field. This is the foundation everything else is built on.
            </p>
          </div>
        </div>
      </section>
      {/* Daily Curriculum */}
      <section className="py-24 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-amber-700/40" />
            <span className="section-label">Daily Curriculum</span>
          </div>
          <div className="space-y-4">
            {modules?.map((mod, i) => (
              <div key={mod?.id} className="bg-white border border-stone-200/80 rounded-sm p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-2">
                    <span className="font-serif text-4xl text-stone-200">{String(i + 1)?.padStart(2, '0')}</span>
                    <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mt-1">Day {i + 1}</p>
                  </div>
                  <div className="lg:col-span-7">
                    <h3 className="font-serif text-xl text-stone-800 mb-3">{mod?.title}</h3>
                    <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">{mod?.description}</p>
                  </div>
                  <div className="lg:col-span-3 flex justify-start lg:justify-end">
                    {mod?.focusArea && (
                      <span className="text-xs font-sans font-medium text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-sm">{mod?.focusArea}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Downloadable Takeaways */}
      {resources?.length > 0 && (
        <section className="py-20 bg-stone-50 border-y border-stone-200/60">
          <div className="editorial-container">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Included Resources</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources?.map(res => (
                <div key={res?.id} className="flex items-center gap-4 bg-white border border-stone-200/80 rounded-sm p-5">
                  <div className="w-10 h-10 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <Download size={16} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-sans font-medium text-stone-800">{res?.title}</p>
                    <p className="text-xs font-sans text-stone-400 mt-0.5 capitalize">{res?.type}</p>
                  </div>
                  <span className="ml-auto text-xs font-sans text-stone-400 bg-stone-100 px-2 py-0.5 rounded-sm capitalize">{res?.accessLevel}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Who It Is For */}
      <section className="py-20 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-amber-700/40" />
                <span className="section-label">Who This Is For</span>
              </div>
              <div className="space-y-4">
                {program?.whoIsItFor?.map(item => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="w-1 h-1 rounded-full bg-amber-700 mt-2.5 shrink-0" />
                    <p className="text-base font-sans font-light text-stone-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-amber-700/40" />
                <span className="section-label">Expected Outcomes</span>
              </div>
              <div className="space-y-4">
                {program?.outcomes?.map(outcome => (
                  <div key={outcome} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-amber-700" />
                    </div>
                    <p className="text-base font-sans font-light text-stone-600 leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="py-20 bg-stone-50 border-t border-stone-200/60">
        <div className="editorial-container max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-amber-700/40" />
            <span className="section-label">Questions</span>
          </div>
          <div className="space-y-2">
            {faqs?.map(faq => (
              <div key={faq?.id} className="border border-stone-200/80 rounded-sm bg-white overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === faq?.id ? null : faq?.id)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-serif text-base text-stone-800">{faq?.question}</span>
                  {openFaq === faq?.id ? <ChevronUp size={16} className="text-stone-400 shrink-0" /> : <ChevronDown size={16} className="text-stone-400 shrink-0" />}
                </button>
                {openFaq === faq?.id && (
                  <div className="px-6 pb-5 border-t border-stone-100">
                    <p className="text-sm font-sans font-light text-stone-500 leading-relaxed pt-4">{faq?.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Purchase CTA */}
      <section className="py-20 bg-stone-900">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-display-md text-stone-100 text-balance leading-[1.1] mb-6">
                Begin the Foundation Course
              </h2>
              <p className="text-base font-sans font-light text-stone-400 leading-relaxed">
                Three days. One hour each. A reset that changes everything that follows.
              </p>
            </div>
            <div className="bg-stone-800/50 border border-stone-700 rounded-sm p-8">
              <p className="font-serif text-3xl text-stone-100 mb-1">{program?.priceLabel}</p>
              <p className="text-sm font-sans text-stone-500 mb-8">{program?.priceNote}</p>
              <a href="/sign-up-login" className="w-full flex items-center justify-center gap-2 bg-amber-700 text-amber-50 py-4 text-sm font-sans font-medium tracking-wide rounded-sm hover:bg-amber-600 transition-colors">
                Enroll Now — ₹999
                <ArrowRight size={15} />
              </a>
              <p className="text-xs font-sans text-stone-600 text-center mt-4">Secure payment · Instant access · Lifetime access</p>
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

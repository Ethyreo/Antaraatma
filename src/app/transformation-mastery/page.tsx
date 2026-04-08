'use client';
import React, { useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { getProgramById, getCoursesByProgram, getModulesByProgram, getFAQsByProgram, getFeaturedTestimonials } from '@/lib/data/mockData';
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function TransformationMasteryPage() {
  const program = getProgramById('prog-mastery');
  const courses = getCoursesByProgram('prog-mastery');
  const modules = getModulesByProgram('prog-mastery');
  const faqs = getFAQsByProgram('prog-mastery');
  const testimonials = getFeaturedTestimonials();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'package'>('monthly');

  if (!program) return null;

  return (
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />
      {/* Hero */}
      <section className="pt-32 pb-20 bg-stone-900">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="text-xs font-sans uppercase tracking-[0.12em] text-amber-600/70">Stage 3 · Transformation · 3 Months</span>
            </div>
            <h1 className="font-serif text-display-lg text-stone-100 text-balance leading-[1.08] mb-8">
              Transformation Mastery
            </h1>
            <p className="text-xl font-sans font-light text-stone-400 leading-relaxed max-w-prose mb-10 text-balance">
              The complete healing journey. Three months of guided transformation — physical, emotional, and energetic — with live sessions, community, and direct access to Dr. Vijay Singla.
            </p>
            <div className="flex flex-wrap gap-6 mb-10">
              {['3 months guided program', 'Live sessions with Dr. Vijay', 'Private community access', 'Certificate of completion', 'Physical healing book']?.map(item => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={14} className="text-amber-500" />
                  <span className="text-sm font-sans text-stone-400">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Why Deep Healing Takes Time */}
      <section className="py-20 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-amber-700/40" />
                <span className="section-label">Why Three Months</span>
              </div>
              <h2 className="font-serif text-display-md text-stone-900 text-balance leading-[1.1] mb-8">
                Deep healing requires time, continuity, and guided structure.
              </h2>
              <p className="text-base font-sans font-light text-stone-500 leading-relaxed mb-6">
                The patterns that create illness took years to form. A weekend workshop cannot undo them. True transformation requires a sustained, structured environment — with guidance, accountability, and community.
              </p>
              <p className="text-base font-sans font-light text-stone-500 leading-relaxed">
                Three months is the minimum time required to move through all three dimensions of healing — physical, emotional, and energetic — and integrate them into a sustainable daily practice.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { month: 'Month 1', focus: 'Physical Foundation', desc: 'Gut healing, nutrition as medicine, sleep optimisation, and physical body audit.' },
                { month: 'Month 2', focus: 'Emotional Clearing', desc: 'Emotional body mapping, relationship patterns, and clearing the blocks to abundance.' },
                { month: 'Month 3', focus: 'Energetic Integration', desc: 'Integrating all dimensions into sustainable daily practices and preparing for certification.' },
              ]?.map((item, i) => (
                <div key={item?.month} className="bg-white border border-stone-200/80 rounded-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-serif text-2xl text-stone-200">{String(i + 1)?.padStart(2, '0')}</span>
                    <div>
                      <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">{item?.month}</p>
                      <p className="font-sans font-semibold text-sm text-amber-800">{item?.focus}</p>
                    </div>
                  </div>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">{item?.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Month-by-Month Curriculum */}
      <section className="py-24 bg-stone-50 border-y border-stone-200/60">
        <div className="editorial-container">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-amber-700/40" />
            <span className="section-label">Full Curriculum</span>
          </div>
          <div className="space-y-8">
            {courses?.map((course) => {
              const courseModules = modules?.filter(m => m?.courseId === course?.id);
              return (
                <div key={course?.id} className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-stone-100 bg-stone-50">
                    <h3 className="font-serif text-xl text-stone-800">{course?.title}</h3>
                    <p className="text-sm font-sans font-light text-stone-500 mt-1">{course?.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-100">
                    {courseModules?.map((mod) => (
                      <div key={mod?.id} className="bg-white p-6">
                        <p className="font-serif text-base text-stone-800 mb-2">{mod?.title}</p>
                        <p className="text-xs font-sans font-light text-stone-500 leading-relaxed">{mod?.description}</p>
                        {mod?.focusArea && (
                          <span className="inline-block mt-3 text-2xs font-sans font-medium text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">{mod?.focusArea}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Benefits & Included */}
      <section className="py-24 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-amber-700/40" />
                <span className="section-label">What Is Included</span>
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
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-amber-700/40" />
                <span className="section-label">Progress & Support</span>
              </div>
              <div className="space-y-5">
                {[
                  { title: 'Live Group Sessions', desc: 'Monthly live sessions with Dr. Vijay Singla for Q&A, guidance, and group healing.' },
                  { title: 'Progress Dashboard', desc: 'Track your journey lesson by lesson, module by module, with clear completion indicators.' },
                  { title: 'Talk to Uni Community', desc: 'Private community for reflection, gratitude, healing wins, and peer support.' },
                  { title: 'Resource Vault Access', desc: 'Full access to all ebooks, audio guides, worksheets, and video content.' },
                ]?.map(item => (
                  <div key={item?.title} className="flex items-start gap-4">
                    <div className="w-1 h-1 rounded-full bg-amber-700 mt-2.5 shrink-0" />
                    <div>
                      <p className="text-sm font-sans font-medium text-stone-800">{item?.title}</p>
                      <p className="text-sm font-sans font-light text-stone-500 mt-0.5">{item?.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 bg-stone-900">
        <div className="editorial-container">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-amber-700/40" />
            <span className="text-xs font-sans uppercase tracking-[0.12em] text-amber-600/70">Transformations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials?.map(t => (
              <div key={t?.id} className="bg-stone-800/50 border border-stone-800 rounded-sm p-8">
                <div className="flex gap-1 mb-5">{Array.from({ length: t?.rating })?.map((_, i) => <span key={i} className="text-amber-500 text-sm">★</span>)}</div>
                <p className="text-sm font-sans font-light text-stone-300 leading-relaxed italic mb-6">&ldquo;{t?.content}&rdquo;</p>
                <p className="text-sm font-sans font-medium text-stone-300">{t?.name}</p>
                {t?.role && <p className="text-xs font-sans text-stone-500 mt-0.5">{t?.role}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing */}
      <section className="py-24 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Choose Your Path</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`text-left p-8 rounded-sm border-2 transition-all duration-200 ${selectedPlan === 'monthly' ? 'border-amber-700 bg-amber-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}
              >
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-3">Monthly</p>
                <p className="font-serif text-3xl text-stone-900 mb-1">₹2,499</p>
                <p className="text-sm font-sans text-stone-500 mb-6">per month · cancel anytime</p>
                <div className="space-y-2">
                  {['Full program access', 'Cancel anytime', 'All resources included']?.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check size={13} className="text-amber-700" />
                      <span className="text-sm font-sans text-stone-600">{f}</span>
                    </div>
                  ))}
                </div>
              </button>
              <button
                onClick={() => setSelectedPlan('package')}
                className={`text-left p-8 rounded-sm border-2 transition-all duration-200 relative ${selectedPlan === 'package' ? 'border-amber-700 bg-amber-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}
              >
                <div className="absolute top-4 right-4">
                  <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-sm">Save ₹500</span>
                </div>
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-3">Full Package</p>
                <p className="font-serif text-3xl text-stone-900 mb-1">₹6,999</p>
                <p className="text-sm font-sans text-stone-500 mb-6">one-time · full 3 months</p>
                <div className="space-y-2">
                  {['Full program access', 'Best value', 'Priority support']?.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check size={13} className="text-amber-700" />
                      <span className="text-sm font-sans text-stone-600">{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            </div>
            <div className="mt-8">
              <a href="/sign-up-login" className="w-full flex items-center justify-center gap-2 bg-amber-800 text-amber-50 py-4 text-base font-sans font-medium tracking-wide rounded-sm hover:bg-amber-900 transition-colors">
                {selectedPlan === 'monthly' ? 'Begin for ₹2,499/month' : 'Enroll for ₹6,999'}
                <ArrowRight size={16} />
              </a>
              <p className="text-xs font-sans text-stone-400 text-center mt-4">Secure payment · Instant access · 7-day satisfaction guarantee</p>
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
      <PublicFooter />
    </main>
  );
}

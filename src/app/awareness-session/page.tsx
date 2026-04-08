'use client';
import React, { useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { getProgramById, getModulesByProgram, getFeaturedTestimonials, getFAQsByProgram } from '@/lib/data/mockData';
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AwarenessSessionPage() {
  const program = getProgramById('prog-awareness');
  const modules = getModulesByProgram('prog-awareness');
  const testimonials = getFeaturedTestimonials().slice(0, 2);
  const faqs = getFAQsByProgram('prog-awareness');

  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);

    console.log('[AwarenessSession] Form submit triggered');
    console.log('[AwarenessSession] Form data:', { name: formData.name, email: formData.email, phone: formData.phone });

    try {
      const supabase = createClient();

      console.log('[AwarenessSession] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('[AwarenessSession] Anon key present:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        source: 'Awareness Session',
        lead_status: 'new',
      };

      console.log('[AwarenessSession] Inserting payload:', payload);

      const { data, error, status, statusText } = await supabase
        .from('leads')
        .insert(payload)
        .select();

      console.log('[AwarenessSession] Insert response — status:', status, statusText);
      console.log('[AwarenessSession] Insert response — data:', data);
      console.log('[AwarenessSession] Insert response — error:', error);

      if (error) {
        console.error('[AwarenessSession] Lead insert FAILED:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        setSubmitError('Registration failed: ' + error.message + (error.hint ? ` (${error.hint})` : ''));
        setLoading(false);
        return;
      }

      console.log('[AwarenessSession] Lead inserted successfully:', data);
    } catch (err) {
      console.error('[AwarenessSession] Unexpected exception during insert:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (!program) return null;

  return (
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-amber-700/40" />
                <span className="section-label">Free · 1 Hour · Online</span>
              </div>
              <h1 className="font-serif text-display-lg text-stone-900 text-balance leading-[1.08] mb-8">
                The Awareness Session
              </h1>
              <p className="text-lg font-sans font-light text-stone-500 leading-relaxed max-w-prose mb-10 text-balance">
                A free, live 1-hour session with Dr. Vijay Singla. Understand why your body holds illness, discover your primary healing blocks, and receive a personalised next-step recommendation.
              </p>
              <div className="flex flex-wrap gap-6 mb-10">
                {[
                  'No credit card required',
                  'Live with Dr. Vijay',
                  'Personalised insight',
                  'Limited seats',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-amber-700" />
                    <span className="text-sm font-sans text-stone-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Capture Form */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-stone-200 rounded-sm p-8 shadow-card">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6">
                      <Check size={24} className="text-amber-700" />
                    </div>
                    <h3 className="font-serif text-xl text-stone-800 mb-3">You&apos;re registered</h3>
                    <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">
                      Check your email for session details. We look forward to seeing you.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-xl text-stone-800 mb-2">Reserve your seat</h3>
                    <p className="text-sm font-sans font-light text-stone-500 mb-6">Next session: 12 April 2026 · Online</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Full name</label>
                        <input
                          type="text"
                          required
                          className="input-base"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Email address</label>
                        <input
                          type="email"
                          required
                          className="input-base"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">
                          Phone <span className="text-stone-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          className="input-base"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary justify-center py-3.5 disabled:opacity-60"
                      >
                        {loading ? 'Registering...' : 'Reserve My Seat — Free'}
                        {!loading && <ArrowRight size={15} />}
                      </button>
                      {submitError && (
                        <p className="text-xs font-sans text-red-600 text-center bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                          {submitError}
                        </p>
                      )}
                      <p className="text-xs font-sans text-stone-400 text-center">Free · No credit card · Cancel anytime</p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Naturopathy Means */}
      <section className="py-20 bg-stone-50 border-y border-stone-200/60">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">What is Naturopathy</span>
            </div>
            <h2 className="font-serif text-display-md text-stone-900 text-balance leading-[1.1] mb-8">
              Not alternative medicine.<br />
              <span className="text-stone-500">Root-cause medicine.</span>
            </h2>
            <p className="text-base font-sans font-light text-stone-500 leading-relaxed mb-6">
              Naturopathy is a system of healthcare that works with the body&apos;s innate healing intelligence — not against it. Rather than suppressing symptoms, it asks why the body is creating them.
            </p>
            <p className="text-base font-sans font-light text-stone-500 leading-relaxed">
              Using nutrition, breathwork, lifestyle modification, and energetic practices, naturopathy addresses the physical, emotional, and energetic layers of illness simultaneously — creating conditions for genuine, lasting healing.
            </p>
          </div>
        </div>
      </section>

      {/* Session Curriculum */}
      <section className="py-24 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-amber-700/40" />
            <span className="section-label">Session Curriculum</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((mod, i) => (
              <div key={mod.id} className="bg-white border border-stone-200/80 rounded-sm p-8">
                <span className="font-serif text-3xl text-stone-200 block mb-4">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-serif text-lg text-stone-800 mb-3">{mod.title}</h3>
                <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">{mod.description}</p>
                {mod.focusArea && (
                  <span className="inline-block mt-4 text-2xs font-sans font-medium text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">{mod.focusArea}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Takeaways */}
      <section className="py-20 bg-stone-50 border-t border-stone-200/60">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-amber-700/40" />
                <span className="section-label">What You Will Leave With</span>
              </div>
              <h2 className="font-serif text-display-md text-stone-900 text-balance leading-[1.1] mb-8">
                One hour. Lasting clarity.
              </h2>
              <div className="space-y-4">
                {program.outcomes.map(outcome => (
                  <div key={outcome} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-amber-700" />
                    </div>
                    <p className="text-base font-sans font-light text-stone-600 leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-stone-200/80 rounded-sm p-10">
              <p className="font-serif text-xl text-stone-800 mb-6 text-balance leading-snug">
                &ldquo;The Awareness Session gave me more clarity about my health in one hour than years of doctor visits.&rdquo;
              </p>
              <p className="text-sm font-sans font-medium text-stone-600">Meena Joshi</p>
              <p className="text-xs font-sans text-stone-400 mt-0.5">Awareness Session Attendee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#FAF8F4] border-t border-stone-200/60">
        <div className="editorial-container">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-amber-700/40" />
            <span className="section-label">Student Experiences</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white border border-stone-200/80 rounded-sm p-8">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-amber-500 text-sm">★</span>)}
                </div>
                <p className="text-sm font-sans font-light text-stone-600 leading-relaxed italic mb-6">&ldquo;{t.content}&rdquo;</p>
                <p className="text-sm font-sans font-medium text-stone-700">{t.name}</p>
                {t.role && <p className="text-xs font-sans text-stone-400 mt-0.5">{t.role}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-stone-50 border-t border-stone-200/60">
        <div className="editorial-container">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Questions</span>
            </div>
            <div className="space-y-2">
              {faqs.slice(0, 4).map(faq => (
                <div key={faq.id} className="border border-stone-200/80 rounded-sm bg-white overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="font-serif text-base text-stone-800">{faq.question}</span>
                    {openFaq === faq.id ? <ChevronUp size={16} className="text-stone-400 shrink-0" /> : <ChevronDown size={16} className="text-stone-400 shrink-0" />}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-5 border-t border-stone-100">
                      <p className="text-sm font-sans font-light text-stone-500 leading-relaxed pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 bg-stone-900">
        <div className="editorial-container text-center">
          <h2 className="font-serif text-display-md text-stone-100 text-balance leading-[1.1] mb-6">
            Ready to begin?
          </h2>
          <p className="text-base font-sans font-light text-stone-400 max-w-prose mx-auto mb-10">
            Join the next free Awareness Session and take the first step toward genuine healing.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-primary text-base px-8 py-4"
          >
            Reserve My Seat — Free
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

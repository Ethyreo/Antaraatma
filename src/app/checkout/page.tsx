'use client';
import React, { useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { mockPrograms } from '@/lib/data/mockData';
import { ArrowRight, Check, Lock, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [selectedProgram, setSelectedProgram] = useState('prog-foundation');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'package' | 'one_time'>('one_time');
  const [step, setStep] = useState<'select' | 'details' | 'success'>('select');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const program = mockPrograms.find(p => p.id === selectedProgram);
  const paidPrograms = mockPrograms.filter(p => p.price > 0 && p.status === 'published');

  const getPrice = () => {
    if (!program) return 0;
    if (selectedPlan === 'package' && program.altPrice) return program.altPrice;
    return program.price;
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend integration point: POST /api/orders/create → then redirect to payment gateway
    setStep('success');
  };

  return (
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />
      <section className="pt-32 pb-20">
        <div className="editorial-container">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Enrollment</span>
            </div>

            {step === 'success' ? (
              <div className="bg-white border border-stone-200/80 rounded-sm p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6">
                  <Check size={28} className="text-amber-700" />
                </div>
                <h2 className="font-serif text-2xl text-stone-800 mb-4">Enrollment Confirmed</h2>
                <p className="text-base font-sans font-light text-stone-500 mb-8">
                  Welcome to {program?.title}. Your access has been activated. Check your email for login details.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/student-dashboard" className="btn-primary">
                    Go to Dashboard
                    <ArrowRight size={15} />
                  </Link>
                  <Link href="/programs-overview" className="btn-ghost">
                    View All Programs
                  </Link>
                </div>
              </div>
            ) : step === 'select' ? (
              <div className="space-y-6">
                <h1 className="font-serif text-display-md text-stone-900 text-balance leading-[1.1]">Choose your program</h1>

                <div className="space-y-4">
                  {paidPrograms.map(prog => (
                    <button
                      key={prog.id}
                      onClick={() => { setSelectedProgram(prog.id); setSelectedPlan(prog.paymentType === 'subscription' ? 'monthly' : 'one_time'); }}
                      className={`w-full text-left p-6 rounded-sm border-2 transition-all duration-200 ${selectedProgram === prog.id ? 'border-amber-700 bg-amber-50/30' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-1">{prog.duration}</p>
                          <h3 className="font-serif text-xl text-stone-800 mb-2">{prog.title}</h3>
                          <p className="text-sm font-sans font-light text-stone-500">{prog.tagline}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-serif text-2xl text-stone-900">{prog.priceLabel}</p>
                          {prog.priceNote && <p className="text-xs font-sans text-stone-400 mt-0.5">{prog.priceNote}</p>}
                        </div>
                      </div>

                      {selectedProgram === prog.id && prog.paymentType === 'subscription' && (
                        <div className="mt-5 pt-5 border-t border-amber-200/60 grid grid-cols-2 gap-3">
                          <button
                            onClick={e => { e.stopPropagation(); setSelectedPlan('monthly'); }}
                            className={`p-3 rounded-sm border text-left transition-colors ${selectedPlan === 'monthly' ? 'border-amber-700 bg-amber-50' : 'border-stone-200 bg-white'}`}
                          >
                            <p className="text-xs font-sans font-medium text-stone-700">Monthly</p>
                            <p className="font-serif text-lg text-stone-900">{prog.priceLabel}</p>
                          </button>
                          {prog.altPrice && (
                            <button
                              onClick={e => { e.stopPropagation(); setSelectedPlan('package'); }}
                              className={`p-3 rounded-sm border text-left transition-colors ${selectedPlan === 'package' ? 'border-amber-700 bg-amber-50' : 'border-stone-200 bg-white'}`}
                            >
                              <p className="text-xs font-sans font-medium text-stone-700">Full Package</p>
                              <p className="font-serif text-lg text-stone-900">{prog.altPriceLabel}</p>
                            </button>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep('details')}
                  className="w-full btn-primary justify-center py-4 text-base"
                >
                  Continue to Enrollment
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h1 className="font-serif text-display-md text-stone-900 text-balance leading-[1.1]">Complete your enrollment</h1>

                <div className="bg-stone-50 border border-stone-200/60 rounded-sm p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-sans font-medium text-stone-800">{program?.title}</p>
                      <p className="text-xs font-sans text-stone-400 mt-0.5">{selectedPlan === 'package' ? 'Full Package' : selectedPlan === 'monthly' ? 'Monthly Subscription' : 'One-time Payment'}</p>
                    </div>
                    <p className="font-serif text-xl text-stone-900">₹{getPrice().toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <form onSubmit={handleProceed} className="space-y-4">
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Full name</label>
                    <input type="text" required className="input-base" placeholder="Your full name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Email address</label>
                    <input type="email" required className="input-base" placeholder="you@example.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Phone <span className="text-stone-400 font-normal">(optional)</span></label>
                    <input type="tel" className="input-base" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 flex items-start gap-3">
                    <Lock size={14} className="text-amber-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-sans font-medium text-amber-900">Secure Payment</p>
                      <p className="text-xs font-sans text-amber-700 mt-0.5">Payment processing will be connected via Stripe. Your details are secure.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep('select')} className="btn-ghost flex-1 justify-center">Back</button>
                    <button type="submit" className="btn-primary flex-1 justify-center py-3.5">
                      <CreditCard size={15} />
                      Proceed to Payment
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs font-sans text-stone-400">
                    <div className="flex items-center gap-1.5"><Shield size={12} />Secure checkout</div>
                    <span>·</span>
                    <span>Instant access after payment</span>
                    <span>·</span>
                    <span>7-day guarantee</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

import React from 'react';

const steps = [
  {
    id: 'explainer-book',
    step: '1',
    title: 'Book an Awareness Session',
    body: 'Start with a 90-minute live session. No commitment required beyond curiosity.',
  },
  {
    id: 'explainer-enroll',
    step: '2',
    title: 'Enroll in Foundation Course',
    body: 'Begin the eight-week curriculum at your pace, with weekly live support from Dr. Vijay.',
  },
  {
    id: 'explainer-advance',
    step: '3',
    title: 'Advance to Mastery',
    body: 'For students ready for deep transformation — a six-month mentored journey to healing mastery.',
  },
  {
    id: 'explainer-graduate',
    step: '4',
    title: 'Graduate & Continue',
    body: 'Receive your certificate, retain lifetime access, and remain part of the healing community.',
  },
];

export default function PathwayExplainer() {
  return (
    <section className="py-24 bg-white">
      <div className="editorial-container">
        <div className="max-w-xl mb-14">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-px bg-amber-700/40" />
            <span className="section-label">How It Works</span>
          </div>
          <h2 className="font-serif text-display-md text-stone-900 text-balance">
            Your journey, step by step
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-10">
          {steps?.map((step) => (
            <div key={step?.id} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-amber-300 flex items-center justify-center shrink-0">
                  <span className="font-serif text-sm text-amber-800">{step?.step}</span>
                </div>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <h3 className="font-serif text-lg text-stone-900 mb-2">{step?.title}</h3>
              <p className="text-sm font-sans font-300 text-stone-600 leading-relaxed">{step?.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
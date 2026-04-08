'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getFAQsByProgram } from '@/lib/data/mockData';

export default function ProgramsFAQ({ programId }: { programId?: string }) {
  const faqs = getFAQsByProgram(programId);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="py-24 bg-stone-50 border-t border-stone-200/60">
      <div className="editorial-container">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-px bg-amber-700/40" />
            <span className="section-label">Frequently Asked Questions</span>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-stone-200/80 rounded-sm bg-white overflow-hidden">
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-serif text-base text-stone-800">{faq.question}</span>
                  {open === faq.id ? <ChevronUp size={16} className="text-stone-400 shrink-0" /> : <ChevronDown size={16} className="text-stone-400 shrink-0" />}
                </button>
                {open === faq.id && (
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
  );
}
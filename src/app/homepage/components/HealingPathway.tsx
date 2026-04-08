import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Backend integration point: fetch programs from /api/programs?featured=true
const pathwaySteps = [
  {
    id: 'pathway-awareness',
    step: '01',
    tag: 'Entry Point',
    title: 'Awareness Session',
    duration: '90 minutes',
    format: 'Live Online',
    price: '₹499',
    description: 'A guided introductory session where Dr. Vijay walks you through the foundations of naturopathic healing and helps you understand your own body patterns.',
    outcomes: ['Understand your root imbalances', 'Meet the healing pathway', 'Ask Dr. Vijay directly'],
    color: 'from-amber-50 to-stone-50',
    accent: 'border-amber-300',
    tagColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'pathway-foundation',
    step: '02',
    tag: 'Core Program',
    title: 'Foundation Course',
    duration: '8 weeks',
    format: 'Self-paced + Live Q&A',
    price: '₹12,000',
    description: 'A structured eight-week curriculum covering nutrition, detoxification, sleep, movement, and mental clarity — the five pillars of naturopathic health.',
    outcomes: ['Five healing pillars', '40+ lessons & resources', 'Weekly live sessions'],
    color: 'from-stone-50 to-white',
    accent: 'border-stone-300',
    tagColor: 'bg-stone-100 text-stone-700',
  },
  {
    id: 'pathway-mastery',
    step: '03',
    tag: 'Advanced',
    title: 'Transformation Mastery',
    duration: '6 months',
    format: 'Mentored Program',
    price: '₹48,000',
    description: 'A deep-immersion mentored program for committed students ready to transform their health at a cellular level and develop mastery over their healing practice.',
    outcomes: ['Personal healing protocol', '1:1 consultations', 'Mastery certificate'],
    color: 'from-stone-900 to-stone-800',
    accent: 'border-amber-600',
    tagColor: 'bg-amber-900/40 text-amber-300',
    dark: true,
  },
];

export default function HealingPathway() {
  return (
    <section id="programs" className="py-28 bg-[#FAF8F4]">
      <div className="editorial-container">
        {/* Header */}
        <div className="max-w-xl mb-20">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-px bg-amber-700/40" />
            <span className="section-label">The Healing Pathway</span>
          </div>
          <h2 className="font-serif text-display-lg text-stone-900 text-balance mb-4">
            Three stages. One journey.
          </h2>
          <p className="text-base font-sans font-300 text-stone-600 leading-relaxed">
            Each stage of the pathway builds on the last — designed to meet you where you are and carry you to where you want to be.
          </p>
        </div>

        {/* Pathway cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
          {pathwaySteps?.map((step, i) => (
            <div
              key={step?.id}
              className={`relative rounded-sm border overflow-hidden ${step?.accent} ${
                step?.dark ? 'bg-stone-900' : `bg-gradient-to-br ${step?.color} bg-white`
              } group hover:shadow-card-hover transition-all duration-300`}
            >
              {/* Step number */}
              <div className="absolute top-0 right-0 p-6">
                <span className={`font-serif text-6xl font-400 ${step?.dark ? 'text-white/10' : 'text-stone-900/8'}`}>
                  {step?.step}
                </span>
              </div>

              <div className="p-8 xl:p-10 flex flex-col h-full">
                {/* Tag */}
                <span className={`status-badge ${step?.tagColor} mb-5 self-start`}>{step?.tag}</span>

                {/* Title */}
                <h3 className={`font-serif text-2xl mb-3 ${step?.dark ? 'text-stone-100' : 'text-stone-900'}`}>
                  {step?.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-5">
                  <span className={`text-xs font-sans font-500 ${step?.dark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {step?.duration}
                  </span>
                  <span className={`text-xs ${step?.dark ? 'text-stone-600' : 'text-stone-300'}`}>·</span>
                  <span className={`text-xs font-sans font-500 ${step?.dark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {step?.format}
                  </span>
                </div>

                {/* Description */}
                <p className={`text-sm font-sans font-300 leading-relaxed mb-6 ${step?.dark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {step?.description}
                </p>

                {/* Outcomes */}
                <ul className="space-y-2 mb-8 flex-1">
                  {step?.outcomes?.map((outcome) => (
                    <li
                      key={`outcome-${step?.id}-${outcome?.toLowerCase()?.replace(/\s/g, '-')?.slice(0, 20)}`}
                      className="flex items-start gap-2.5"
                    >
                      <span className={`mt-1 w-1 h-1 rounded-full shrink-0 ${step?.dark ? 'bg-amber-500' : 'bg-amber-700'}`} />
                      <span className={`text-xs font-sans font-500 ${step?.dark ? 'text-stone-400' : 'text-stone-600'}`}>
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-current/10">
                  <span className={`font-serif text-xl tabular-nums ${step?.dark ? 'text-amber-400' : 'text-stone-900'}`}>
                    {step?.price}
                  </span>
                  <Link
                    href="/programs-overview"
                    className={`flex items-center gap-1.5 text-xs font-sans font-500 group-hover:gap-2.5 transition-all ${
                      step?.dark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-800 hover:text-amber-900'
                    }`}
                  >
                    Learn more <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Connector line */}
        <div className="hidden lg:flex items-center justify-center mt-8 gap-0">
          <p className="text-xs font-sans text-stone-400 tracking-wide">
            Each stage is a prerequisite for the next — building knowledge, trust, and transformation progressively
          </p>
        </div>
      </div>
    </section>
  );
}
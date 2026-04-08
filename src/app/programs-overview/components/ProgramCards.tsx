'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Clock, Users, BookOpen, Award } from 'lucide-react';

// Backend integration point: fetch from /api/programs?status=published
const programs = [
  {
    id: 'prog-awareness',
    slug: 'awareness-session',
    stage: '01',
    tag: 'Start Here',
    tagColor: 'bg-amber-100 text-amber-800',
    title: 'Awareness Session',
    subtitle: 'Your first conversation with your own body',
    price: '₹499',
    priceNote: 'One-time · Refundable',
    duration: '90 minutes',
    format: 'Live Online',
    students: 1842,
    modules: 1,
    level: 'Open to all',
    description: 'A guided 90-minute live session where Dr. Vijay introduces the foundations of naturopathic healing and helps you map your personal health patterns. This is the entry point to the pathway.',
    features: [
      'Live session with Dr. Vijay Singla',
      'Personal body pattern assessment',
      'Naturopathy fundamentals overview',
      'Q&A and direct consultation time',
      'Recorded replay for 30 days',
      'Pathway recommendation report',
    ],
    outcomes: 'Clarity on your root imbalances and a clear recommendation for your next step.',
    highlight: false,
  },
  {
    id: 'prog-foundation',
    slug: 'foundation-course',
    stage: '02',
    tag: 'Most Popular',
    tagColor: 'bg-sage/20 text-stone-700',
    title: 'Foundation Course',
    subtitle: 'The eight-week core healing curriculum',
    price: '₹12,000',
    priceNote: 'One-time · Lifetime access',
    duration: '8 weeks',
    format: 'Self-paced + Live Q&A',
    students: 748,
    modules: 8,
    level: 'Awareness Session required',
    description: 'A structured eight-week curriculum covering the five pillars of naturopathic health: nutrition, detoxification, sleep, movement, and mental clarity. Includes weekly live Q&A sessions with Dr. Vijay.',
    features: [
      '40+ video lessons across 8 modules',
      'Weekly live Q&A with Dr. Vijay',
      'Downloadable workbooks & protocols',
      'Student community access',
      'Progress tracking dashboard',
      'Foundation Certificate on completion',
    ],
    outcomes: 'Measurable improvements in energy, digestion, sleep, and mental clarity within 8 weeks.',
    highlight: true,
  },
  {
    id: 'prog-mastery',
    slug: 'transformation-mastery',
    stage: '03',
    tag: 'Advanced',
    tagColor: 'bg-stone-100 text-stone-700',
    title: 'Transformation Mastery',
    subtitle: 'Six-month deep-immersion mentorship',
    price: '₹48,000',
    priceNote: 'One-time or 3 instalments',
    duration: '6 months',
    format: 'Mentored Program',
    students: 124,
    modules: 24,
    level: 'Foundation Course required',
    description: 'A six-month mentored deep-immersion program for students committed to complete healing transformation. Includes personal protocol development, 1:1 consultations, and a comprehensive Mastery Certificate.',
    features: [
      '24 advanced modules + 80+ lessons',
      'Personal healing protocol development',
      '4 × 1:1 consultations with Dr. Vijay',
      'Advanced community & peer circles',
      'Lab result interpretation sessions',
      'Transformation Mastery Certificate',
    ],
    outcomes: 'Complete healing protocol ownership, measurable biomarker improvements, and Mastery Certificate.',
    highlight: false,
  },
];

export default function ProgramCards() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  return (
    <section className="py-16 bg-[#FAF8F4]">
      <div className="editorial-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start">
          {programs?.map((program) => (
            <div
              key={program?.id}
              className={`relative rounded-sm border transition-all duration-300 overflow-hidden ${
                program?.highlight
                  ? 'border-amber-300 shadow-card-hover bg-white'
                  : 'border-stone-200 bg-white hover:shadow-card-hover'
              }`}
            >
              {program?.highlight && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
              )}

              <div className="p-8 xl:p-9">
                {/* Stage + Tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-4xl text-stone-900/8">{program?.stage}</span>
                  <span className={`status-badge ${program?.tagColor}`}>{program?.tag}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl text-stone-900 mb-1">{program?.title}</h3>
                <p className="text-sm font-sans font-300 text-stone-500 mb-5">{program?.subtitle}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-3xl text-stone-900 tabular-nums">{program?.price}</span>
                </div>
                <p className="text-xs font-sans text-stone-500 mb-6">{program?.priceNote}</p>

                {/* Meta row */}
                <div className="grid grid-cols-2 gap-3 mb-6 py-5 border-y border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-stone-400" />
                    <span className="text-xs font-sans text-stone-600">{program?.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={13} className="text-stone-400" />
                    <span className="text-xs font-sans text-stone-600">{program?.modules} modules</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-stone-400" />
                    <span className="text-xs font-sans text-stone-600 tabular-nums">{program?.students?.toLocaleString()} enrolled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award size={13} className="text-stone-400" />
                    <span className="text-xs font-sans text-stone-600">Certificate</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm font-sans font-300 text-stone-600 leading-relaxed mb-6">
                  {program?.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-8">
                  {program?.features?.map((feat) => (
                    <li
                      key={`feat-${program?.id}-${feat?.slice(0, 20)?.toLowerCase()?.replace(/\s/g, '-')}`}
                      className="flex items-start gap-2.5"
                    >
                      <Check size={13} className="text-amber-700 mt-0.5 shrink-0" />
                      <span className="text-xs font-sans font-500 text-stone-700">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Prereq */}
                <p className="text-xs font-sans text-stone-400 mb-6 italic">{program?.level}</p>

                {/* CTA */}
                <Link
                  href="/sign-up-login"
                  className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-sans font-500 tracking-wide transition-all duration-200 active:scale-95 rounded-sm ${
                    program?.highlight
                      ? 'bg-amber-800 text-amber-50 hover:bg-amber-900' :'border border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Enroll Now
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
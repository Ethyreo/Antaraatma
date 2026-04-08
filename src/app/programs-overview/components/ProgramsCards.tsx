'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { mockPrograms, getCoursesByProgram, getModulesByProgram } from '@/lib/data/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProgramsCards() {
  const programs = mockPrograms?.filter(p => p?.status === 'published')?.sort((a, b) => a?.order - b?.order);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  return (
    <section className="py-24 bg-[#FAF8F4]">
      <div className="editorial-container space-y-8">
        {programs?.map((program, i) => {
          const courses = getCoursesByProgram(program?.id);
          const modules = getModulesByProgram(program?.id);
          const isExpanded = expandedProgram === program?.id;

          return (
            <div key={program?.id} className={`border rounded-sm overflow-hidden ${i === 2 ? 'border-stone-800 bg-stone-900' : 'border-stone-200/80 bg-white'}`}>
              <div className="p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs font-sans font-medium uppercase tracking-widest ${i === 2 ? 'text-amber-500/70' : 'text-stone-400'}`}>
                        Stage {program?.order} · {program?.duration}
                      </span>
                      {program?.price === 0 && (
                        <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">Free</span>
                      )}
                      {i === 2 && (
                        <span className="text-2xs font-sans font-medium text-amber-400 bg-amber-900/30 border border-amber-700/30 px-2 py-0.5 rounded-sm">Flagship</span>
                      )}
                    </div>
                    <h2 className={`font-serif text-display-md mb-4 ${i === 2 ? 'text-stone-100' : 'text-stone-900'}`}>{program?.title}</h2>
                    <p className={`text-base font-sans font-light leading-relaxed mb-6 ${i === 2 ? 'text-stone-400' : 'text-stone-500'}`}>{program?.longDescription}</p>

                    <div className="space-y-2">
                      {program?.outcomes?.map((outcome) => (
                        <div key={outcome} className="flex items-start gap-3">
                          <div className={`w-1 h-1 rounded-full mt-2 shrink-0 ${i === 2 ? 'bg-amber-500' : 'bg-amber-700'}`} />
                          <p className={`text-sm font-sans ${i === 2 ? 'text-stone-400' : 'text-stone-500'}`}>{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className={`rounded-sm p-6 h-full flex flex-col justify-between ${i === 2 ? 'bg-stone-800/50 border border-stone-700' : 'bg-stone-50 border border-stone-200/60'}`}>
                      <div>
                        <p className={`text-xs font-sans font-medium uppercase tracking-widest mb-2 ${i === 2 ? 'text-stone-500' : 'text-stone-400'}`}>Investment</p>
                        <p className={`font-serif text-3xl mb-1 ${i === 2 ? 'text-stone-100' : 'text-stone-900'}`}>{program?.priceLabel}</p>
                        {program?.priceNote && <p className={`text-xs font-sans ${i === 2 ? 'text-stone-500' : 'text-stone-400'}`}>{program?.priceNote}</p>}
                        {program?.altPriceLabel && (
                          <p className={`text-sm font-sans mt-2 ${i === 2 ? 'text-stone-400' : 'text-stone-500'}`}>or {program?.altPriceLabel}</p>
                        )}
                      </div>

                      <div className="mt-8 space-y-3">
                        <Link href={`/${program?.slug}`} className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-sans font-medium tracking-wide rounded-sm transition-all duration-200 ${
                          i === 2
                            ? 'bg-amber-700 text-amber-50 hover:bg-amber-600'
                            : program?.price === 0
                            ? 'bg-amber-800 text-amber-50 hover:bg-amber-900' :'bg-stone-900 text-stone-50 hover:bg-stone-800'
                        }`}>
                          {program?.price === 0 ? 'Register Free' : 'Enroll Now'}
                        </Link>
                        <button
                          onClick={() => setExpandedProgram(isExpanded ? null : program?.id)}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-sans transition-colors ${i === 2 ? 'text-stone-400 hover:text-stone-300' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                          {isExpanded ? 'Hide curriculum' : 'View curriculum'}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Curriculum Preview */}
                {isExpanded && (
                  <div className={`mt-8 pt-8 border-t ${i === 2 ? 'border-stone-800' : 'border-stone-100'}`}>
                    <p className={`text-xs font-sans font-medium uppercase tracking-widest mb-6 ${i === 2 ? 'text-stone-500' : 'text-stone-400'}`}>Curriculum</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courses?.map((course) => {
                        const courseModules = modules?.filter(m => m?.courseId === course?.id);
                        return (
                          <div key={course?.id} className={`rounded-sm p-5 ${i === 2 ? 'bg-stone-800/40 border border-stone-700/50' : 'bg-stone-50 border border-stone-200/60'}`}>
                            <p className={`font-serif text-base mb-3 ${i === 2 ? 'text-stone-200' : 'text-stone-800'}`}>{course?.title}</p>
                            <div className="space-y-1.5">
                              {courseModules?.map((mod) => (
                                <div key={mod?.id} className="flex items-start gap-2">
                                  <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${i === 2 ? 'bg-stone-600' : 'bg-stone-300'}`} />
                                  <p className={`text-xs font-sans ${i === 2 ? 'text-stone-400' : 'text-stone-500'}`}>{mod?.title}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

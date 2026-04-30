'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { mockPrograms, getCoursesByProgram, getModulesByProgram } from '@/lib/data/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ProgramsCards() {
  const programs = mockPrograms?.filter(p => p?.status === 'published')?.sort((a, b) => a?.order - b?.order);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  return (
    <section className="py-24" style={{ background: '#F4EFE6' }}>
      <div className="editorial-container space-y-8">
        {programs?.map((program, i) => {
          const courses = getCoursesByProgram(program?.id);
          const modules = getModulesByProgram(program?.id);
          const isExpanded = expandedProgram === program?.id;
          const isFlagship = i === 2;

          return (
            <div
              key={program?.id}
              className="rounded-sm overflow-hidden"
              style={isFlagship
                ? { background: '#1A6B6B', border: '1px solid rgba(95,189,189,0.3)' }
                : { background: 'white', border: '1px solid rgba(168,216,206,0.5)' }
              }
            >
              <div className="p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-sans uppercase tracking-widest" style={{ color: isFlagship ? 'rgba(244,239,230,0.45)' : '#3A7A5A', fontWeight: 600 }}>
                        Stage {program?.order} · {program?.duration}
                      </span>
                      {program?.price === 0 && (
                        <span className="text-2xs font-sans px-2 py-0.5 rounded-sm" style={{ color: '#1A6B6B', background: 'rgba(26,107,107,0.08)', border: '1px solid rgba(26,107,107,0.2)', fontWeight: 600 }}>Free</span>
                      )}
                      {isFlagship && (
                        <span className="text-2xs font-sans px-2 py-0.5 rounded-sm" style={{ color: '#C4A052', background: 'rgba(196,160,82,0.12)', border: '1px solid rgba(196,160,82,0.3)', fontWeight: 600 }}>Flagship</span>
                      )}
                    </div>
                    <h2 className="font-serif text-display-md mb-4" style={{ color: isFlagship ? '#F4EFE6' : '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>{program?.title}</h2>
                    <p className="text-base font-sans font-light leading-relaxed mb-6" style={{ color: isFlagship ? 'rgba(244,239,230,0.55)' : 'rgba(36,44,44,0.5)', fontWeight: 300 }}>{program?.longDescription}</p>

                    <div className="space-y-2">
                      {program?.outcomes?.map((outcome) => (
                        <div key={outcome} className="flex items-start gap-3">
                          <div className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: isFlagship ? '#C4A052' : '#1A6B6B' }} />
                          <p className="text-sm font-sans" style={{ color: isFlagship ? 'rgba(244,239,230,0.55)' : 'rgba(36,44,44,0.55)', fontWeight: 300 }}>{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div
                      className="rounded-sm p-6 h-full flex flex-col justify-between"
                      style={isFlagship
                        ? { background: 'rgba(244,239,230,0.08)', border: '1px solid rgba(244,239,230,0.15)' }
                        : { background: '#D4EDE8', border: '1px solid rgba(168,216,206,0.5)' }
                      }
                    >
                      <div>
                        <p className="text-xs font-sans uppercase tracking-widest mb-2" style={{ color: isFlagship ? 'rgba(244,239,230,0.35)' : '#3A7A5A', fontWeight: 600 }}>Investment</p>
                        <p className="font-serif text-3xl mb-1" style={{ color: isFlagship ? '#F4EFE6' : '#1A6B6B', fontWeight: 300 }}>{program?.priceLabel}</p>
                        {program?.priceNote && <p className="text-xs font-sans" style={{ color: isFlagship ? 'rgba(244,239,230,0.35)' : 'rgba(36,44,44,0.45)', fontWeight: 400 }}>{program?.priceNote}</p>}
                        {program?.altPriceLabel && (
                          <p className="text-sm font-sans mt-2" style={{ color: isFlagship ? 'rgba(244,239,230,0.45)' : 'rgba(36,44,44,0.5)', fontWeight: 300 }}>or {program?.altPriceLabel}</p>
                        )}
                      </div>

                      <div className="mt-8 space-y-3">
                        <Link
                          href={`/${program?.slug}`}
                          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-sans tracking-wide rounded-sm transition-all duration-200"
                          style={isFlagship
                            ? { background: '#F4EFE6', color: '#1A6B6B', fontWeight: 600 }
                            : { background: '#1A6B6B', color: '#F4EFE6', fontWeight: 600 }
                          }
                          onMouseEnter={e => {
                            if (isFlagship) (e.currentTarget.style.background = '#D4EDE8');
                            else (e.currentTarget.style.background = '#155858');
                          }}
                          onMouseLeave={e => {
                            if (isFlagship) (e.currentTarget.style.background = '#F4EFE6');
                            else (e.currentTarget.style.background = '#1A6B6B');
                          }}
                        >
                          {program?.price === 0 ? 'Register Free' : 'Enroll Now'}
                        </Link>
                        <button
                          onClick={() => setExpandedProgram(isExpanded ? null : program?.id)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-sans transition-colors"
                          style={{ color: isFlagship ? 'rgba(244,239,230,0.45)' : 'rgba(26,107,107,0.55)', fontWeight: 400 }}
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
                  <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${isFlagship ? 'rgba(244,239,230,0.12)' : 'rgba(168,216,206,0.3)'}` }}>
                    <p className="text-xs font-sans uppercase tracking-widest mb-6" style={{ color: isFlagship ? 'rgba(244,239,230,0.35)' : '#3A7A5A', fontWeight: 600 }}>Curriculum</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courses?.map((course) => {
                        const courseModules = modules?.filter(m => m?.courseId === course?.id);
                        return (
                          <div key={course?.id} className="rounded-sm p-5" style={isFlagship ? { background: 'rgba(244,239,230,0.06)', border: '1px solid rgba(244,239,230,0.1)' } : { background: '#D4EDE8', border: '1px solid rgba(168,216,206,0.4)' }}>
                            <p className="font-serif text-base mb-3" style={{ color: isFlagship ? 'rgba(244,239,230,0.8)' : '#1A6B6B', fontWeight: 300 }}>{course?.title}</p>
                            <div className="space-y-1.5">
                              {courseModules?.map((mod) => (
                                <div key={mod?.id} className="flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: isFlagship ? 'rgba(244,239,230,0.3)' : 'rgba(26,107,107,0.3)' }} />
                                  <p className="text-xs font-sans" style={{ color: isFlagship ? 'rgba(244,239,230,0.45)' : 'rgba(36,44,44,0.5)', fontWeight: 300 }}>{mod?.title}</p>
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

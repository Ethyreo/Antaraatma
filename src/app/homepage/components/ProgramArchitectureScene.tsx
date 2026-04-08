'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getFeaturedPrograms } from '@/lib/data/mockData';

export default function ProgramArchitectureScene() {
  const programs = getFeaturedPrograms();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [rowVisible, setRowVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
            programs?.forEach((_, i) => {
              setTimeout(() => {
                setRowVisible(prev => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, 150 + i * 160);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [programs]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: '#111009',
        paddingTop: 'clamp(6rem, 14vw, 11rem)',
        paddingBottom: 'clamp(6rem, 14vw, 11rem)',
      }}
    >
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 65% at 8% 50%, rgba(180,130,55,0.04) 0%, transparent 60%)',
        }}
      />
      <div className="editorial-container relative z-10">
        {/* Header */}
        <div
          className="text-center mb-20 lg:mb-28"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          <p
            className="text-xs font-sans uppercase tracking-[0.2em] mb-10 inline-block"
            style={{ color: 'rgba(180,130,55,0.45)' }}
          >
            Program Architecture
          </p>
          <h2
            className="font-serif text-balance mx-auto"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              color: 'rgba(232,224,208,0.9)',
              lineHeight: 1.0,
              maxWidth: '18ch',
            }}
          >
            One ascending path.<br />
            <span style={{ color: 'rgba(232,224,208,0.2)' }}>Three distinct thresholds.</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <Link
              href="/programs-overview"
              className="text-xs font-sans uppercase tracking-widest"
              style={{
                color: 'rgba(232,224,208,0.22)',
                transition: 'color 0.22s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,224,208,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,224,208,0.22)')}
            >
              All programs →
            </Link>
          </div>
        </div>

        {/* Programs */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {programs?.map((program, i) => {
            const isLast = i === programs?.length - 1;
            return (
              <div
                key={program?.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 group"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  opacity: rowVisible[i] ? 1 : 0,
                  transform: rowVisible[i] ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ease, transform 0.8s ease`,
                }}
              >
                {/* Left — stage + duration */}
                <div className="lg:col-span-3 py-10 lg:py-14 lg:pr-10">
                  <p
                    className="font-sans text-xs uppercase tracking-widest mb-3"
                    style={{ color: isLast ? 'rgba(180,130,55,0.55)' : 'rgba(232,224,208,0.2)' }}
                  >
                    {program?.duration}
                  </p>
                  <p
                    className="font-serif"
                    style={{
                      fontSize: isLast ? 'clamp(1.8rem, 3vw, 2.6rem)' : 'clamp(1.4rem, 2.2vw, 1.9rem)',
                      color: isLast ? 'rgba(232,224,208,0.88)' : 'rgba(232,224,208,0.32)',
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1)?.padStart(2, '0')}
                  </p>
                  {isLast && (
                    <p
                      className="text-xs font-sans uppercase tracking-widest mt-3"
                      style={{ color: 'rgba(180,130,55,0.45)' }}
                    >
                      Flagship
                    </p>
                  )}
                </div>
                {/* Center — title + description */}
                <div
                  className="lg:col-span-6 py-10 lg:py-14 lg:px-12"
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <h3
                    className="font-serif mb-4 text-balance"
                    style={{
                      fontSize: isLast ? 'clamp(1.3rem, 2vw, 1.85rem)' : 'clamp(1rem, 1.6vw, 1.4rem)',
                      color: isLast ? 'rgba(232,224,208,0.9)' : 'rgba(232,224,208,0.52)',
                    }}
                  >
                    {program?.title}
                  </h3>
                  <p
                    className="font-sans font-light leading-relaxed max-w-[50ch]"
                    style={{ fontSize: '0.875rem', color: 'rgba(232,224,208,0.24)' }}
                  >
                    {program?.description}
                  </p>
                </div>
                {/* Right — price + CTA */}
                <div
                  className="lg:col-span-3 py-10 lg:py-14 lg:pl-10 flex flex-col justify-between"
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div>
                    <p
                      className="font-serif mb-1"
                      style={{
                        fontSize: '1.4rem',
                        color: isLast ? 'rgba(232,224,208,0.88)' : 'rgba(232,224,208,0.42)',
                      }}
                    >
                      {program?.priceLabel}
                    </p>
                    {program?.priceNote && (
                      <p className="text-xs font-sans" style={{ color: 'rgba(232,224,208,0.18)' }}>
                        {program?.priceNote}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/${program?.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-sans font-medium mt-8"
                    style={{
                      color: isLast ? 'rgba(180,130,55,0.75)' : 'rgba(232,224,208,0.28)',
                      transition: 'color 0.22s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = isLast ? '#d4a855' : 'rgba(232,224,208,0.65)';
                      const arrow = e.currentTarget.querySelector('span');
                      if (arrow) (arrow as HTMLElement).style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = isLast ? 'rgba(180,130,55,0.75)' : 'rgba(232,224,208,0.28)';
                      const arrow = e.currentTarget.querySelector('span');
                      if (arrow) (arrow as HTMLElement).style.transform = 'translateX(0)';
                    }}
                  >
                    Learn more
                    <span style={{ display: 'inline-block', transition: 'transform 0.22s ease' }}>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

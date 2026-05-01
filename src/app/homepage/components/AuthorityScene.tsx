'use client';
import React, { useEffect, useRef, useState } from 'react';
import { getFeaturedTestimonials } from '@/lib/data/mockData';

export default function AuthorityScene() {
  const testimonials = getFeaturedTestimonials();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [testimonialVisible, setTestimonialVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
            testimonials?.forEach((_, i) => {
              setTimeout(() => {
                setTestimonialVisible(prev => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, 300 + i * 150);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [testimonials]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: '#F4EFE6',
        paddingTop: 'clamp(6rem, 14vw, 11rem)',
        paddingBottom: 'clamp(6rem, 14vw, 11rem)',
      }}
    >
      {/* Botanical line art watermark */}
      <div className="absolute right-0 top-0 pointer-events-none opacity-[0.06]" aria-hidden="true">
        <svg width="400" height="600" viewBox="0 0 400 600" fill="none">
          <path d="M200 580 Q180 500 160 420 Q140 340 180 280 Q220 220 200 140 Q180 60 200 20" stroke="#3A7A5A" strokeWidth="1" fill="none"/>
          <path d="M200 420 Q160 400 130 370 Q100 340 120 300" stroke="#3A7A5A" strokeWidth="0.8" fill="none"/>
          <path d="M200 380 Q240 360 260 330 Q280 300 260 270" stroke="#3A7A5A" strokeWidth="0.8" fill="none"/>
          <path d="M200 300 Q155 285 135 255 Q115 225 140 200" stroke="#3A7A5A" strokeWidth="0.8" fill="none"/>
          <path d="M200 260 Q245 245 265 215 Q285 185 260 160" stroke="#3A7A5A" strokeWidth="0.8" fill="none"/>
          <ellipse cx="130" cy="300" rx="30" ry="18" stroke="#3A7A5A" strokeWidth="0.8" transform="rotate(-30 130 300)"/>
          <ellipse cx="260" cy="270" rx="30" ry="18" stroke="#3A7A5A" strokeWidth="0.8" transform="rotate(30 260 270)"/>
        </svg>
      </div>

      <div className="editorial-container relative z-10">
        {/* Dr. Vijay header */}
        <div
          className="text-center mb-16 lg:mb-24 pb-16 lg:pb-24"
          style={{
            borderBottom: '1px solid rgba(36,44,44,0.08)',
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          <p
            className="text-xs font-sans uppercase tracking-[0.2em] mb-10 inline-block"
            style={{ color: 'rgba(26,107,107,0.6)', fontWeight: 600 }}
          >
            About Dr. Vijay
          </p>
          <h2
            className="font-serif text-balance mx-auto"
            style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
              color: 'rgba(36,44,44,0.88)',
              lineHeight: 1.05,
              fontWeight: 300,
              letterSpacing: '0.04em',
              maxWidth: '22ch',
            }}
          >
            12 years of clinical practice.
          </h2>
          <h2
            className="font-serif text-balance mt-1 mx-auto"
            style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
              color: 'rgba(36,44,44,0.18)',
              lineHeight: 1.05,
              fontWeight: 300,
              letterSpacing: '0.04em',
              maxWidth: '22ch',
            }}
          >
            2,400+ students transformed.
          </h2>

          <p
            className="font-sans font-light leading-relaxed mt-10 mx-auto"
            style={{ fontSize: '0.9rem', color: 'rgba(36,44,44,0.42)', maxWidth: '56ch', fontWeight: 300 }}
          >
            Dr. Vijay Singla developed a structured healing methodology addressing the physical, emotional, and energetic dimensions of illness — creating lasting transformation rather than temporary relief.
          </p>

          {/* Stats */}
          <div
            className="flex items-center justify-center gap-12 mt-12 pt-10"
            style={{ borderTop: '1px solid rgba(36,44,44,0.07)' }}
          >
            {[
              { value: '94%', label: 'Completion Rate' },
              { value: '12 yrs', label: 'Clinical Practice' },
              { value: '2,400+', label: 'Students' },
            ]?.map((stat) => (
              <div key={stat?.label} className="text-center">
                <p
                  className="font-serif tabular-nums"
                  style={{ fontSize: '1.5rem', color: '#1A6B6B', fontWeight: 300 }}
                >
                  {stat?.value}
                </p>
                <p
                  className="text-xs font-sans uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(36,44,44,0.3)', fontWeight: 600 }}
                >
                  {stat?.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <p
            className="text-xs font-sans uppercase tracking-[0.2em] mb-16 text-center"
            style={{
              color: 'rgba(26,107,107,0.6)',
              fontWeight: 600,
              opacity: headerVisible ? 1 : 0,
              transition: 'opacity 1s ease 0.2s',
            }}
          >
            Student Transformations
          </p>

          <div style={{ borderTop: '1px solid rgba(36,44,44,0.07)' }}>
            {testimonials?.map((t, i) => (
              <div
                key={t?.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 py-12"
                style={{
                  borderBottom: '1px solid rgba(36,44,44,0.07)',
                  opacity: testimonialVisible[i] ? 1 : 0,
                  transform: testimonialVisible[i] ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ease, transform 0.8s ease`,
                }}
              >
                <div className="lg:col-span-3 mb-5 lg:mb-0">
                  <p className="font-sans font-medium text-sm" style={{ color: 'rgba(36,44,44,0.55)', fontWeight: 500 }}>
                    {t?.name}
                  </p>
                  {t?.role && (
                    <p className="text-xs font-sans mt-0.5" style={{ color: 'rgba(36,44,44,0.28)', fontWeight: 400 }}>
                      {t?.role}
                    </p>
                  )}
                </div>
                <div className="lg:col-span-9 lg:pl-12">
                  {/* Pull quote style — Raleway italic */}
                  <p
                    className="font-serif text-balance leading-relaxed"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.28rem)',
                      color: '#1A6B6B',
                      fontStyle: 'italic',
                      fontWeight: 300,
                      opacity: 0.7,
                    }}
                  >
                    &ldquo;{t?.content}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

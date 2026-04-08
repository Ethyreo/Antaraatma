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
        background: '#111009',
        paddingTop: 'clamp(6rem, 14vw, 11rem)',
        paddingBottom: 'clamp(6rem, 14vw, 11rem)',
      }}
    >
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 45% 55% at 92% 25%, rgba(100,110,90,0.03) 0%, transparent 60%)',
        }}
      />
      <div className="editorial-container relative z-10">
        {/* Dr. Vijay header */}
        <div
          className="text-center mb-16 lg:mb-24 pb-16 lg:pb-24"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          <p
            className="text-xs font-sans uppercase tracking-[0.2em] mb-10 inline-block"
            style={{ color: 'rgba(180,130,55,0.45)' }}
          >
            About Dr. Vijay
          </p>
          <h2
            className="font-serif text-balance mx-auto"
            style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
              color: 'rgba(232,224,208,0.9)',
              lineHeight: 1.0,
              maxWidth: '20ch',
            }}
          >
            12 years of clinical practice.
          </h2>
          <h2
            className="font-serif text-balance mt-1 mx-auto"
            style={{
              fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
              color: 'rgba(232,224,208,0.18)',
              lineHeight: 1.0,
              maxWidth: '20ch',
            }}
          >
            2,400+ students transformed.
          </h2>

          <p
            className="font-sans font-light leading-relaxed mt-10 mx-auto"
            style={{ fontSize: '0.9rem', color: 'rgba(232,224,208,0.32)', maxWidth: '56ch' }}
          >
            Dr. Vijay Singla developed a structured healing methodology addressing the physical, emotional, and energetic dimensions of illness — creating lasting transformation rather than temporary relief.
          </p>

          {/* Stats */}
          <div
            className="flex items-center justify-center gap-12 mt-12 pt-10"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {[
              { value: '94%', label: 'Completion Rate' },
              { value: '12 yrs', label: 'Clinical Practice' },
              { value: '2,400+', label: 'Students' },
            ]?.map((stat) => (
              <div key={stat?.label} className="text-center">
                <p
                  className="font-serif tabular-nums"
                  style={{ fontSize: '1.5rem', color: 'rgba(232,224,208,0.62)' }}
                >
                  {stat?.value}
                </p>
                <p
                  className="text-xs font-sans uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(232,224,208,0.18)' }}
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
              color: 'rgba(180,130,55,0.45)',
              opacity: headerVisible ? 1 : 0,
              transition: 'opacity 1s ease 0.2s',
            }}
          >
            Student Transformations
          </p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {testimonials?.map((t, i) => (
              <div
                key={t?.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 py-12"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  opacity: testimonialVisible[i] ? 1 : 0,
                  transform: testimonialVisible[i] ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.8s ease, transform 0.8s ease`,
                }}
              >
                <div className="lg:col-span-3 mb-5 lg:mb-0">
                  <p
                    className="font-sans font-medium text-sm"
                    style={{ color: 'rgba(232,224,208,0.45)' }}
                  >
                    {t?.name}
                  </p>
                  {t?.role && (
                    <p className="text-xs font-sans mt-0.5" style={{ color: 'rgba(232,224,208,0.18)' }}>
                      {t?.role}
                    </p>
                  )}
                </div>
                <div className="lg:col-span-9 lg:pl-12">
                  <p
                    className="font-serif text-balance leading-relaxed"
                    style={{
                      fontSize: 'clamp(1rem, 1.6vw, 1.28rem)',
                      color: 'rgba(232,224,208,0.5)',
                      fontStyle: 'italic',
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

'use client';
import React, { useEffect, useRef, useState } from 'react';

const areas = [
  { label: 'Body', description: 'Gut health, inflammation, chronic pain, and physical vitality.' },
  { label: 'Breath', description: 'Nervous system regulation and energetic renewal through pranayama.' },
  { label: 'Energy', description: 'Restoring the body\'s energetic field and building sustainable vitality.' },
  { label: 'Emotions', description: 'Processing stored emotional patterns that manifest as physical symptoms.' },
  { label: 'Relationships', description: 'How relational dynamics shape the body\'s health — and how to shift them.' },
  { label: 'Abundance', description: 'Clearing the energetic blocks that limit vitality and life force.' },
];

export default function TransformationAreasScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [rowVisible, setRowVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
            areas.forEach((_, i) => {
              setTimeout(() => {
                setRowVisible(prev => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, 100 + i * 100);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.016]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
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
            style={{ color: 'rgba(26,107,107,0.65)', fontWeight: 600 }}
          >
            Areas of Transformation
          </p>
          <h2
            className="font-serif text-balance mx-auto"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              color: '#1A2828',
              lineHeight: 1.0,
              maxWidth: '20ch',
            }}
          >
            Healing happens across<br />
            <span style={{ color: 'rgba(36,44,44,0.22)' }}>every dimension of life.</span>
          </h2>
        </div>

        {/* Areas list */}
        <div style={{ borderTop: '1px solid rgba(36,44,44,0.08)' }}>
          {areas?.map((area, i) => (
            <div
              key={area?.label}
              className="grid grid-cols-1 lg:grid-cols-12 gap-0 group"
              style={{
                borderBottom: '1px solid rgba(36,44,44,0.08)',
                opacity: rowVisible[i] ? 1 : 0,
                transform: rowVisible[i] ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity 0.7s ease, transform 0.7s ease`,
              }}
            >
              <div
                className="lg:col-span-3 py-8 lg:py-10"
              >
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                    color: '#1A6B6B',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {area?.label}
                </h3>
              </div>
              <div
                className="lg:col-span-9 py-8 lg:py-10 lg:pl-12 flex items-center"
                style={{ borderLeft: '1px solid rgba(36,44,44,0.07)' }}
              >
                <p
                  className="font-sans font-light leading-relaxed max-w-[52ch]"
                  style={{ fontSize: '0.875rem', color: 'rgba(36,44,44,0.45)' }}
                >
                  {area?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

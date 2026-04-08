'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function ClosingScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#0e0d0b', paddingTop: 'clamp(6rem, 14vw, 12rem)', paddingBottom: 'clamp(6rem, 14vw, 12rem)' }}
    >
      {/* Ambient glow — centered, very subtle */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 55%, rgba(180,130,55,0.06) 0%, transparent 65%)' }} />
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />
      {/* Centered composition */}
      <div className="editorial-container relative z-10 flex flex-col items-center text-center">
        {/* Headline */}
        <h2
          className="font-serif text-balance mx-auto mb-10"
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            color: 'rgba(232,224,208,0.88)',
            lineHeight: 1.0,
            maxWidth: '14ch',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          The first step<br />
          costs nothing.
        </h2>

        <p
          className="font-sans font-light leading-relaxed mb-16 mx-auto"
          style={{
            fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
            color: 'rgba(232,224,208,0.3)',
            maxWidth: '36ch',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
          }}
        >
          One hour. No commitment. A genuine beginning.
        </p>

        {/* CTAs — centered */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 1s ease 0.38s, transform 1s ease 0.38s',
          }}
        >
          <Link
            href="/awareness-session"
            className="group inline-flex items-center gap-3 text-sm font-sans tracking-wide"
            style={{
              color: 'rgba(212,168,85,0.85)',
              transition: 'color 0.25s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#d4a855')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,168,85,0.85)')}
          >
            Join the Free Awareness Session
            <span
              style={{ display: 'inline-block', transition: 'transform 0.25s ease', opacity: 0.6 }}
              ref={el => {
                if (!el) return;
                el?.closest('a')?.addEventListener('mouseenter', () => { el.style.transform = 'translateX(4px)'; });
                el?.closest('a')?.addEventListener('mouseleave', () => { el.style.transform = 'translateX(0)'; });
              }}
            >→</span>
          </Link>
          <Link
            href="/programs-overview"
            className="inline-flex items-center gap-3 text-sm font-sans tracking-wide"
            style={{
              color: 'rgba(220,210,195,0.25)',
              transition: 'color 0.25s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(220,210,195,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(220,210,195,0.25)')}
          >
            View All Programs
          </Link>
        </div>

        {/* Reassurance */}
        <p
          className="mt-12 text-xs font-sans uppercase tracking-widest"
          style={{
            color: 'rgba(232,224,208,0.12)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.6s',
          }}
        >
          Free · No credit card required · Online · 1 hour
        </p>
      </div>
    </section>
  );
}

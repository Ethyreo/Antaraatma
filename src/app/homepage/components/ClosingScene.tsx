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
      style={{ background: '#1A2828', paddingTop: 'clamp(6rem, 14vw, 12rem)', paddingBottom: 'clamp(6rem, 14vw, 12rem)' }}
    >
      {/* Sacred geometry — lotus mandala watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" opacity="0.05" aria-hidden="true">
          <circle cx="250" cy="250" r="50" stroke="#5FBDBD" strokeWidth="0.8"/>
          <circle cx="250" cy="250" r="100" stroke="#5FBDBD" strokeWidth="0.8"/>
          <circle cx="250" cy="250" r="150" stroke="#5FBDBD" strokeWidth="0.8"/>
          <circle cx="250" cy="250" r="200" stroke="#5FBDBD" strokeWidth="0.8"/>
          <circle cx="250" cy="250" r="240" stroke="#5FBDBD" strokeWidth="0.8"/>
          <line x1="250" y1="10" x2="250" y2="490" stroke="#5FBDBD" strokeWidth="0.5"/>
          <line x1="10" y1="250" x2="490" y2="250" stroke="#5FBDBD" strokeWidth="0.5"/>
          <line x1="80" y1="80" x2="420" y2="420" stroke="#5FBDBD" strokeWidth="0.5"/>
          <line x1="420" y1="80" x2="80" y2="420" stroke="#5FBDBD" strokeWidth="0.5"/>
          <circle cx="250" cy="250" r="5" fill="#C4A052" opacity="0.8"/>
        </svg>
      </div>

      {/* Ambient teal glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 55%, rgba(26,107,107,0.08) 0%, transparent 65%)' }} />

      <div className="editorial-container relative z-10 flex flex-col items-center text-center">
        {/* Sacred Gold rule */}
        <div className="flex items-center gap-4 mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          <div className="w-12 h-px" style={{ background: '#C4A052', opacity: 0.5 }} />
          <span className="text-xs font-sans uppercase tracking-[0.2em]" style={{ color: '#C4A052', opacity: 0.7, fontWeight: 600 }}>
            Dr. Vijay Singla · Antaraatma
          </span>
          <div className="w-12 h-px" style={{ background: '#C4A052', opacity: 0.5 }} />
        </div>

        {/* Headline — Raleway 200 weight */}
        <h2
          className="font-serif text-balance mx-auto mb-10"
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
            color: 'rgba(244,239,230,0.88)',
            lineHeight: 1.05,
            fontWeight: 200,
            letterSpacing: '0.05em',
            maxWidth: '16ch',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease 0.1s, transform 1s ease 0.1s',
          }}
        >
          The first step<br />
          costs nothing.
        </h2>

        {/* Pull quote style */}
        <p
          className="font-serif leading-relaxed mb-6 mx-auto"
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            color: 'rgba(95,189,189,0.55)',
            maxWidth: '40ch',
            fontStyle: 'italic',
            fontWeight: 300,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
          }}
        >
          &ldquo;Your soul does not need to be fixed. It needs to be heard.&rdquo;
        </p>

        <p
          className="font-sans font-light leading-relaxed mb-16 mx-auto"
          style={{
            fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
            color: 'rgba(244,239,230,0.28)',
            maxWidth: '36ch',
            fontWeight: 300,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s',
          }}
        >
          One hour. No commitment. A genuine beginning.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 1s ease 0.42s, transform 1s ease 0.42s',
          }}
        >
          <Link
            href="/awareness-session"
            className="inline-flex items-center gap-3 px-8 py-3.5 text-sm font-sans tracking-wide rounded-sm transition-all duration-300"
            style={{ background: '#1A6B6B', color: '#F4EFE6', fontWeight: 600, letterSpacing: '0.06em' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#155858')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1A6B6B')}
          >
            Join the Free Awareness Session
          </Link>
          <Link
            href="/programs-overview"
            className="inline-flex items-center gap-3 text-sm font-sans tracking-wide transition-all duration-300"
            style={{ color: 'rgba(168,216,206,0.35)', fontWeight: 400 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(168,216,206,0.65)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(168,216,206,0.35)')}
          >
            View All Programs →
          </Link>
        </div>

        <p
          className="mt-12 text-xs font-sans uppercase tracking-widest"
          style={{
            color: 'rgba(244,239,230,0.1)',
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

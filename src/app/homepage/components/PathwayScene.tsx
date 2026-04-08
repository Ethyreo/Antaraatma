'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const stages = [
  {
    number: '01',
    label: 'Awareness',
    duration: '1 hour',
    durationNote: 'Free · Live',
    heading: 'Understand what your body is communicating.',
    body: 'A free live session introducing the root-cause framework and your first personalised insight.',
    href: '/awareness-session',
    cta: 'Join Free Session',
    accent: true,
  },
  {
    number: '02',
    label: 'Implementation',
    duration: '3 days',
    durationNote: '1 hour per day · ₹999',
    heading: 'Reset your physical and energetic body.',
    body: 'A focused 3-day course that moves understanding into practice — gut, breath, and energy reset.',
    href: '/foundation-course',
    cta: 'Explore Foundation Course',
    accent: false,
  },
  {
    number: '03',
    label: 'Transformation',
    duration: '3 months',
    durationNote: 'Guided · Live · Community',
    heading: 'Deep, guided healing across all dimensions.',
    body: 'The complete program — physical, emotional, and energetic transformation with live sessions and certification.',
    href: '/transformation-mastery',
    cta: 'Explore Mastery Program',
    accent: false,
  },
];

export default function PathwayScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [rowVisible, setRowVisible] = useState([false, false, false]);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
            [0, 1, 2].forEach(i => {
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
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: '#FAF8F4',
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
            style={{ color: 'rgba(180,130,55,0.5)' }}
          >
            The Healing Pathway
          </p>
          <h2
            className="font-serif text-balance mx-auto"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              color: '#1c1a17',
              lineHeight: 1.0,
              maxWidth: '18ch',
            }}
          >
            Three stages.<br />
            <span style={{ color: 'rgba(28,26,23,0.25)' }}>One ascending journey.</span>
          </h2>
          <p
            className="font-sans font-light leading-relaxed text-balance mx-auto mt-8"
            style={{ color: 'rgba(28,26,23,0.38)', fontSize: '0.9rem', maxWidth: '44ch' }}
          >
            Healing is not a single event. It is a structured progression — from understanding to practice to lasting transformation.
          </p>
        </div>

        {/* Pathway rows */}
        <div style={{ borderTop: '1px solid rgba(28,26,23,0.07)' }}>
          {stages?.map((stage, i) => (
            <div
              key={stage?.label}
              className="grid grid-cols-1 lg:grid-cols-12 gap-0 group"
              style={{
                borderBottom: '1px solid rgba(28,26,23,0.07)',
                opacity: rowVisible?.[i] ? 1 : 0,
                transform: rowVisible?.[i] ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.8s ease, transform 0.8s ease`,
              }}
            >
              {/* Duration column */}
              <div
                className="lg:col-span-3 py-10 lg:py-14 lg:pr-10"
              >
                <p
                  className="font-sans font-semibold text-xs uppercase tracking-[0.14em] mb-2"
                  style={{ color: stage?.accent ? 'rgba(180,130,55,0.75)' : 'rgba(28,26,23,0.28)' }}
                >
                  {stage?.label}
                </p>
                <p
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                    color: stage?.accent ? '#1c1a17' : 'rgba(28,26,23,0.38)',
                    lineHeight: 1,
                  }}
                >
                  {stage?.duration}
                </p>
                <p className="text-xs font-sans mt-2" style={{ color: 'rgba(28,26,23,0.25)' }}>
                  {stage?.durationNote}
                </p>
              </div>

              {/* Content column */}
              <div
                className="lg:col-span-9 py-10 lg:py-14 lg:pl-12"
                style={{ borderLeft: '1px solid rgba(28,26,23,0.07)' }}
              >
                <h3
                  className="font-serif mb-3 text-balance"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)', color: '#1c1a17' }}
                >
                  {stage?.heading}
                </h3>
                <p
                  className="font-sans font-light leading-relaxed mb-7 max-w-[52ch]"
                  style={{ fontSize: '0.875rem', color: 'rgba(28,26,23,0.4)' }}
                >
                  {stage?.body}
                </p>
                <Link
                  href={stage?.href}
                  className="inline-flex items-center gap-2 text-sm font-sans font-medium"
                  style={{
                    color: stage?.accent ? 'rgba(180,130,55,0.85)' : 'rgba(28,26,23,0.38)',
                    transition: 'color 0.22s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = stage?.accent ? '#b4822a' : '#1c1a17';
                    const arrow = e?.currentTarget?.querySelector('span');
                    if (arrow) (arrow as HTMLElement).style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = stage?.accent ? 'rgba(180,130,55,0.85)' : 'rgba(28,26,23,0.38)';
                    const arrow = e?.currentTarget?.querySelector('span');
                    if (arrow) (arrow as HTMLElement).style.transform = 'translateX(0)';
                  }}
                >
                  {stage?.cta}
                  <span style={{ display: 'inline-block', transition: 'transform 0.22s ease' }}>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

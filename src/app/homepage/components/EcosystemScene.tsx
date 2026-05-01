'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const ecosystemItems = [
  {
    label: 'Resource Vault',
    description: 'Ebooks, audio guides, and worksheets — curated for each stage of your journey.',
    href: '/resource-vault',
    tag: 'Enrolled Students',
  },
  {
    label: 'Talk to Uni',
    description: 'A private community for reflection, gratitude, and healing wins. Intimate and purposeful.',
    href: '/community',
    tag: 'Community',
  },
  {
    label: 'Progress Tracking',
    description: 'Your journey mapped — lesson by lesson. Know exactly where you are.',
    href: '/student-dashboard',
    tag: 'Dashboard',
  },
  {
    label: 'Certificate',
    description: 'Complete the Transformation Mastery program and receive a certificate of your journey.',
    href: '/transformation-mastery',
    tag: 'Mastery Program',
  },
  {
    label: 'Physical Healing Book',
    description: 'A curated physical guide delivered to your door — a tangible companion to your digital journey.',
    href: '/transformation-mastery',
    tag: 'Mastery Program',
  },
];

export default function EcosystemScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [itemVisible, setItemVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
            ecosystemItems.forEach((_, i) => {
              setTimeout(() => {
                setItemVisible(prev => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, 100 + i * 110);
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
      {/* Pale Mist grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.016]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Botanical watermark — left side */}
      <div className="absolute left-0 bottom-0 pointer-events-none opacity-[0.06]" aria-hidden="true">
        <svg width="300" height="400" viewBox="0 0 300 400" fill="none">
          <path d="M150 390 Q130 320 110 250 Q90 180 130 120 Q170 60 150 20" stroke="#3A7A5A" strokeWidth="1" fill="none"/>
          <path d="M150 280 Q110 260 90 230 Q70 200 95 175" stroke="#3A7A5A" strokeWidth="0.8" fill="none"/>
          <path d="M150 240 Q190 220 210 190 Q230 160 205 135" stroke="#3A7A5A" strokeWidth="0.8" fill="none"/>
          <ellipse cx="90" cy="175" rx="25" ry="15" stroke="#3A7A5A" strokeWidth="0.8" transform="rotate(-25 90 175)"/>
          <ellipse cx="205" cy="135" rx="25" ry="15" stroke="#3A7A5A" strokeWidth="0.8" transform="rotate(25 205 135)"/>
        </svg>
      </div>

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
            style={{ color: '#3A7A5A', fontWeight: 600 }}
          >
            The Ecosystem
          </p>
          <h2
            className="font-serif text-balance mx-auto"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              color: '#1A6B6B',
              lineHeight: 1.05,
              fontWeight: 300,
              letterSpacing: '0.04em',
              maxWidth: '20ch',
            }}
          >
            Everything you need<br />
            <span style={{ color: 'rgba(26,107,107,0.25)' }}>to heal — in one place.</span>
          </h2>
        </div>

        {/* Ecosystem list */}
        <div style={{ borderTop: '1px solid rgba(26,107,107,0.1)' }}>
          {ecosystemItems?.map((item, i) => (
            <Link
              key={item?.label}
              href={item?.href}
              className="grid grid-cols-1 lg:grid-cols-12 gap-0 block"
              style={{
                borderBottom: '1px solid rgba(26,107,107,0.1)',
                opacity: itemVisible[i] ? 1 : 0,
                transform: itemVisible[i] ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity 0.7s ease, transform 0.7s ease, background 0.25s ease`,
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(168,216,206,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <div className="lg:col-span-4 py-8 lg:py-10">
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                    color: '#1A6B6B',
                    fontWeight: 300,
                    letterSpacing: '0.04em',
                  }}
                >
                  {item?.label}
                </h3>
                <p
                  className="text-xs font-sans uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(26,107,107,0.35)', fontWeight: 600 }}
                >
                  {item?.tag}
                </p>
              </div>
              <div
                className="lg:col-span-7 lg:col-start-6 py-8 lg:py-10 flex items-center justify-between"
                style={{ borderLeft: '1px solid rgba(26,107,107,0.08)' }}
              >
                <p
                  className="font-sans font-light leading-relaxed max-w-[50ch] lg:pl-12"
                  style={{ fontSize: '0.875rem', color: 'rgba(36,44,44,0.45)', fontWeight: 300 }}
                >
                  {item?.description}
                </p>
                <span
                  className="hidden lg:block ml-8 text-sm font-sans"
                  style={{
                    color: 'rgba(26,107,107,0.25)',
                    display: 'inline-block',
                    transition: 'transform 0.22s ease, color 0.22s ease',
                  }}
                  ref={el => {
                    if (!el) return;
                    const parent = el.closest('a');
                    if (!parent) return;
                    const enter = () => {
                      el.style.transform = 'translateX(5px)';
                      el.style.color = '#1A6B6B';
                    };
                    const leave = () => {
                      el.style.transform = 'translateX(0)';
                      el.style.color = 'rgba(26,107,107,0.25)';
                    };
                    parent.addEventListener('mouseenter', enter);
                    parent.addEventListener('mouseleave', leave);
                  }}
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

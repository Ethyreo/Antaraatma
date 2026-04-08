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
            The Ecosystem
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
            Everything you need<br />
            <span style={{ color: 'rgba(28,26,23,0.22)' }}>to heal — in one place.</span>
          </h2>
        </div>

        {/* Ecosystem list */}
        <div style={{ borderTop: '1px solid rgba(28,26,23,0.07)' }}>
          {ecosystemItems?.map((item, i) => (
            <Link
              key={item?.label}
              href={item?.href}
              className="grid grid-cols-1 lg:grid-cols-12 gap-0 block"
              style={{
                borderBottom: '1px solid rgba(28,26,23,0.07)',
                opacity: itemVisible[i] ? 1 : 0,
                transform: itemVisible[i] ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity 0.7s ease, transform 0.7s ease, background 0.25s ease`,
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(28,26,23,0.025)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <div
                className="lg:col-span-4 py-8 lg:py-10"
              >
                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                    color: '#1c1a17',
                    transition: 'color 0.22s ease',
                  }}
                >
                  {item?.label}
                </h3>
                <p
                  className="text-xs font-sans uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(28,26,23,0.22)' }}
                >
                  {item?.tag}
                </p>
              </div>
              <div
                className="lg:col-span-7 lg:col-start-6 py-8 lg:py-10 flex items-center justify-between"
                style={{ borderLeft: '1px solid rgba(28,26,23,0.07)' }}
              >
                <p
                  className="font-sans font-light leading-relaxed max-w-[50ch] lg:pl-12"
                  style={{ fontSize: '0.875rem', color: 'rgba(28,26,23,0.35)' }}
                >
                  {item?.description}
                </p>
                <span
                  className="hidden lg:block ml-8 text-sm font-sans"
                  style={{
                    color: 'rgba(28,26,23,0.2)',
                    display: 'inline-block',
                    transition: 'transform 0.22s ease, color 0.22s ease',
                  }}
                  ref={el => {
                    if (!el) return;
                    const parent = el.closest('a');
                    if (!parent) return;
                    const enter = () => {
                      el.style.transform = 'translateX(5px)';
                      el.style.color = 'rgba(28,26,23,0.5)';
                    };
                    const leave = () => {
                      el.style.transform = 'translateX(0)';
                      el.style.color = 'rgba(28,26,23,0.2)';
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

'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { getFeaturedPrograms } from '@/lib/data/mockData';

const cards = [
  {
    number: '01',
    label: 'Awareness',
    tagline: 'Free · Live · 1 Hour',
    heading: 'Understand what your body is communicating.',
    body: 'A free live session introducing the root-cause framework and your first personalised insight. Begin by seeing clearly — what is blocked, why it stalls, and what is truly possible.',
    href: '/awareness-session',
    cta: 'Join Free Session',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx="14" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
    accent: '#1A6B6B',
    accentLight: 'rgba(26,107,107,0.08)',
    accentBorder: 'rgba(26,107,107,0.28)',
    textAccent: '#1A6B6B',
  },
  {
    number: '02',
    label: 'Implementation',
    tagline: '3 Days · ₹999 · 1 hr/day',
    heading: 'Reset your physical and energetic body.',
    body: 'A focused 3-day course that moves understanding into practice — gut, breath, and energy reset. Feel the shift as your body begins to respond to intentional care.',
    href: '/foundation-course',
    cta: 'Explore Foundation Course',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4 L14 24 M4 14 L24 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 8 L20 20 M20 8 L8 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
      </svg>
    ),
    accent: '#1A6B6B',
    accentLight: 'rgba(26,107,107,0.07)',
    accentBorder: 'rgba(26,107,107,0.26)',
    textAccent: '#1A6B6B',
  },
  {
    number: '03',
    label: 'Transformation',
    tagline: '3 Months · Guided · Live',
    heading: 'Deep, guided healing across all dimensions.',
    body: 'The complete program — physical, emotional, and energetic transformation with live sessions and certification. Emerge as someone who has truly healed, not just managed.',
    href: '/transformation-mastery',
    cta: 'Explore Mastery Program',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3 L17 11 L26 11 L19 16.5 L21.5 25 L14 20 L6.5 25 L9 16.5 L2 11 L11 11 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    accent: '#1A6B6B',
    accentLight: 'rgba(26,107,107,0.07)',
    accentBorder: 'rgba(26,107,107,0.26)',
    textAccent: '#1A6B6B',
  },
];

export default function PathwaySliderSection() {
  const programs = getFeaturedPrograms();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rowVisible, setRowVisible] = useState<boolean[]>([]);
  const dragStart = useRef(0);
  const dragDelta = useRef(0);

  useEffect(() => {
    const fallback = setTimeout(() => setVisible(true), 400);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          clearTimeout(fallback);
          programs?.forEach((_, i) => {
            setTimeout(() => {
              setRowVisible(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, 300 + i * 160);
          });
        }
      },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [programs]);

  const goTo = useCallback((idx: number) => {
    setActive(Math.max(0, Math.min(cards.length - 1, idx)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
    dragDelta.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    dragDelta.current = e.clientX - dragStart.current;
  };
  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDelta.current < -50) goTo(active + 1);
    else if (dragDelta.current > 50) goTo(active - 1);
    dragDelta.current = 0;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: '#F4EFE6',
        paddingTop: 'clamp(5rem, 12vw, 9rem)',
        paddingBottom: 'clamp(6rem, 14vw, 11rem)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 30%, rgba(26,107,107,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="editorial-container relative z-10">
        {/* Unified Header */}
        <div
          className="text-center mb-16 lg:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          <p
            className="text-xs font-sans uppercase tracking-[0.22em] mb-6 inline-block"
            style={{ color: 'rgba(26,107,107,0.7)' }}
          >
            Program Architecture
          </p>
          <h2
            className="font-serif text-balance mx-auto"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.6rem)',
              color: '#1A2828',
              lineHeight: 1.05,
              maxWidth: '22ch',
            }}
          >
            One ascending path.<br />
            <span style={{ color: 'rgba(36,44,44,0.28)' }}>Three distinct thresholds.</span>
          </h2>
          <p
            className="font-sans font-light leading-relaxed text-balance mx-auto mt-6"
            style={{ color: 'rgba(36,44,44,0.42)', fontSize: '0.875rem', maxWidth: '46ch' }}
          >
            Each stage builds on the last — from awareness to action to lasting transformation.
          </p>
        </div>

        {/* Slider Cards */}
        <div
          ref={trackRef}
          className="relative select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Desktop: all 3 cards — inline styles only, no Tailwind */}
          <div className="hidden lg:block">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                justifyContent: 'center',
                alignItems: 'stretch',
                margin: '0 auto',
                width: 'fit-content',
              }}
            >
              {cards.map((card, i) => (
                <div
                  key={card.label}
                  style={{
                    width: '220px',
                    minWidth: '220px',
                    maxWidth: '220px',
                    flexShrink: 0,
                    flexGrow: 0,
                    overflow: 'hidden',
                  }}
                >
                  <SliderCard card={card} index={i} visible={visible} isActive={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile slider */}
          <div className="lg:hidden" style={{ overflow: 'hidden', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                width: `${cards.length * 100}%`,
                transform: `translateX(calc(-${active * (100 / cards.length)}%))`,
                transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {cards.map((card, i) => (
                <div
                  key={card.label}
                  style={{
                    width: `${100 / cards.length}%`,
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    padding: '0 12px',
                  }}
                >
                  <SliderCard card={card} index={i} visible={visible} isActive={i === active} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile dots */}
          <div className="lg:hidden flex justify-center gap-3 mt-8">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === active ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === active ? cards[active].accent : 'rgba(36,44,44,0.15)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Desktop label nav */}
        <div className="hidden lg:flex justify-center gap-4 mt-12">
          {cards.map((card, i) => (
            <button
              key={card.label}
              onClick={() => goTo(i)}
              className="font-sans text-xs uppercase tracking-[0.14em] px-4 py-2 rounded-full"
              style={{
                background: 'transparent',
                border: `1px solid ${i === active ? card.accent : 'rgba(36,44,44,0.12)'}`,
                color: i === active ? card.accent : 'rgba(36,44,44,0.35)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {card.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CardData {
  number: string;
  label: string;
  tagline: string;
  heading: string;
  body: string;
  href: string;
  cta: string;
  icon: React.ReactNode;
  accent: string;
  accentLight: string;
  accentBorder: string;
  textAccent: string;
}

function SliderCard({
  card,
  index,
  visible,
  isActive,
}: {
  card: CardData;
  index: number;
  visible: boolean;
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        background: hovered ? card.accentLight : 'rgba(255,255,255,0.55)',
        border: `1px solid ${hovered ? card.accentBorder : 'rgba(36,44,44,0.08)'}`,
        borderRadius: '16px',
        padding: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        cursor: 'default',
        opacity: visible ? (isActive ? 1 : 0.85) : 0,
        transform: visible
          ? hovered
            ? 'translateY(-4px) scale(1.012)'
            : 'translateY(0) scale(1)'
          : `translateY(36px) scale(0.97)`,
        transition: `opacity 0.75s ease ${index * 0.15}s, transform ${hovered ? '0.35s ease' : `0.75s ease ${index * 0.15}s`}, background 0.3s ease, border-color 0.3s ease, box-shadow 0.35s ease`,
        boxShadow: hovered
          ? `0 14px 40px rgba(36,44,44,0.12), 0 0 0 1px ${card.accentBorder}`
          : '0 4px 16px rgba(36,44,44,0.06)',
        minHeight: '260px',
      }}
    >
      {/* Top row: number + icon */}
      <div className="flex items-start justify-between">
        <span
          className="font-serif"
          style={{
            fontSize: '2rem',
            lineHeight: 1,
            color: hovered ? card.accent : 'rgba(36,44,44,0.12)',
            transition: 'color 0.35s ease',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {card.number}
        </span>
        <span
          style={{
            color: hovered ? card.accent : 'rgba(36,44,44,0.3)',
            transition: 'color 0.35s ease, transform 0.35s ease',
            transform: hovered ? 'rotate(12deg) scale(1.1)' : 'rotate(0deg) scale(1)',
            display: 'inline-flex',
          }}
        >
          {card.icon}
        </span>
      </div>

      {/* Label + tagline */}
      <div>
        <p
          className="font-sans font-semibold text-xs uppercase tracking-[0.16em] mb-1"
          style={{ color: card.textAccent, opacity: hovered ? 1 : 0.75, transition: 'opacity 0.3s ease' }}
        >
          {card.label}
        </p>
        <p
          className="font-sans text-xs"
          style={{ color: 'rgba(36,44,44,0.38)' }}
        >
          {card.tagline}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background: hovered ? card.accentBorder : 'rgba(36,44,44,0.07)',
          transition: 'background 0.35s ease',
        }}
      />

      {/* Heading */}
      <h3
        className="font-serif text-balance"
        style={{
          fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)',
          color: '#1A2828',
          lineHeight: 1.3,
          flex: 1,
        }}
      >
        {card.heading}
      </h3>

      {/* Body */}
      <p
        className="font-sans font-light leading-relaxed"
        style={{
          fontSize: '0.78rem',
          color: 'rgba(36,44,44,0.45)',
          lineHeight: 1.65,
        }}
      >
        {card.body}
      </p>

      {/* CTA */}
      <Link
        href={card.href}
        className="inline-flex items-center gap-2 font-sans font-medium text-sm mt-auto"
        style={{
          color: hovered ? card.accent : 'rgba(36,44,44,0.38)',
          transition: 'color 0.3s ease',
          textDecoration: 'none',
        }}
        onMouseEnter={e => {
          const arrow = e.currentTarget.querySelector('span');
          if (arrow) (arrow as HTMLElement).style.transform = 'translateX(5px)';
        }}
        onMouseLeave={e => {
          const arrow = e.currentTarget.querySelector('span');
          if (arrow) (arrow as HTMLElement).style.transform = 'translateX(0)';
        }}
      >
        {card.cta}
        <span style={{ display: 'inline-block', transition: 'transform 0.25s ease' }}>→</span>
      </Link>
    </div>
  );
}

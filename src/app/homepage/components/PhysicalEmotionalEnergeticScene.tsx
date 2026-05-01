'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';

const dimensions = [
  {
    id: '01',
    label: 'Physical',
    headline: 'The body carries what the mind cannot process.',
    body: 'Chronic pain, fatigue, digestive dysfunction — these are the body\'s language for unresolved patterns. Naturopathy reads that language and responds at the root.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <circle cx="20" cy="20" r="10" stroke="rgba(26,107,107,0.5)" strokeWidth="0.8" />
        <circle cx="20" cy="20" r="5" fill="rgba(26,107,107,0.12)" stroke="rgba(26,107,107,0.35)" strokeWidth="0.6" />
        <line x1="20" y1="4" x2="20" y2="10" stroke="rgba(26,107,107,0.4)" strokeWidth="0.7" />
        <line x1="20" y1="30" x2="20" y2="36" stroke="rgba(26,107,107,0.4)" strokeWidth="0.7" />
        <line x1="4" y1="20" x2="10" y2="20" stroke="rgba(26,107,107,0.4)" strokeWidth="0.7" />
        <line x1="30" y1="20" x2="36" y2="20" stroke="rgba(26,107,107,0.4)" strokeWidth="0.7" />
      </svg>
    ),
  },
  {
    id: '02',
    label: 'Emotional',
    headline: 'Unprocessed emotions become physical symptoms.',
    body: 'Grief lives in the chest. Fear in the gut. Anxiety, suppressed anger — each emotion that never found resolution becomes a pattern held in tissue and nervous system.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <path d="M20 32 C10 24, 6 18, 6 14 C6 9.5 9.5 7 13 7 C16 7 18.5 9 20 11 C21.5 9 24 7 27 7 C30.5 7 34 9.5 34 14 C34 18 30 24 20 32Z" stroke="rgba(26,107,107,0.45)" strokeWidth="0.8" fill="rgba(26,107,107,0.07)" />
        <path d="M20 28 C13 22, 10 17, 10 14 C10 11.5 11.5 10 13 10 C15 10 17 11.5 20 14" stroke="rgba(26,107,107,0.2)" strokeWidth="0.5" fill="none" />
      </svg>
    ),
  },
  {
    id: '03',
    label: 'Energetic',
    headline: 'Depletion is not a lifestyle problem. It is a signal.',
    body: 'When the body\'s energetic field is disrupted, no supplement or willpower restores vitality. The energetic dimension governs how life force moves through you — and this is where lasting transformation is anchored.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <circle cx="20" cy="20" r="14" stroke="rgba(26,107,107,0.15)" strokeWidth="0.5" />
        <circle cx="20" cy="20" r="9" stroke="rgba(26,107,107,0.25)" strokeWidth="0.6" />
        <circle cx="20" cy="20" r="4" stroke="rgba(26,107,107,0.45)" strokeWidth="0.7" fill="rgba(26,107,107,0.08)" />
        <circle cx="20" cy="20" r="1.5" fill="rgba(26,107,107,0.6)" />
        <path d="M20 6 Q26 13 20 20 Q14 27 20 34" stroke="rgba(26,107,107,0.3)" strokeWidth="0.6" fill="none" />
        <path d="M6 20 Q13 14 20 20 Q27 26 34 20" stroke="rgba(26,107,107,0.3)" strokeWidth="0.6" fill="none" />
      </svg>
    ),
  },
];

// Stage 0 = intro "Why healing stalls", Stages 1-3 = Physical/Emotional/Energetic
const TOTAL_STAGES = 4;
const STAGE_THRESHOLD = 280;

export default function PhysicalEmotionalEnergeticScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [locked, setLocked] = useState(false);

  const accDelta = useRef(0);
  const lockedRef = useRef(false);
  const stageRef = useRef(0);

  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  const enterLock = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    sectionRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
  }, []);

  const exitLock = useCallback(() => {
    lockedRef.current = false;
    setLocked(false);
    accDelta.current = 0;
  }, []);

  // IntersectionObserver — always re-lock when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Always re-lock on entry, reset accumulated delta
          accDelta.current = 0;
          enterLock();
        } else if (!entry.isIntersecting) {
          if (lockedRef.current) exitLock();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [enterLock, exitLock]);

  // Wheel handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      const currentStage = stageRef.current;

      if (delta > 0) {
        accDelta.current += delta;
        if (accDelta.current >= STAGE_THRESHOLD) {
          accDelta.current = 0;
          if (currentStage < TOTAL_STAGES - 1) {
            setStage(currentStage + 1);
          } else {
            exitLock();
          }
        }
      } else if (delta < 0) {
        accDelta.current += delta;
        if (accDelta.current <= -STAGE_THRESHOLD) {
          accDelta.current = 0;
          if (currentStage > 0) {
            setStage(currentStage - 1);
          } else {
            exitLock();
          }
        }
      }
    },
    [exitLock]
  );

  const touchStartY = useRef(0);
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      const dy = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      const currentStage = stageRef.current;

      if (dy > 0) {
        accDelta.current += dy * 3;
        if (accDelta.current >= STAGE_THRESHOLD) {
          accDelta.current = 0;
          if (currentStage < TOTAL_STAGES - 1) {
            setStage(currentStage + 1);
          } else {
            exitLock();
          }
        }
      } else if (dy < 0) {
        accDelta.current += dy * 3;
        if (accDelta.current <= -STAGE_THRESHOLD) {
          accDelta.current = 0;
          if (currentStage > 0) {
            setStage(currentStage - 1);
          } else {
            exitLock();
          }
        }
      }
    },
    [exitLock]
  );

  // Attach wheel/touch to WINDOW when locked — captures all scroll events reliably
  useEffect(() => {
    if (!locked) return;

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [locked, handleWheel, handleTouchStart, handleTouchMove]);

  // Lock both body and html scroll when locked
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [locked]);

  const dimIndex = stage - 1;
  const timelineFillPercent = dimIndex < 0 ? 0 : dimIndex === 0 ? 0 : dimIndex === 1 ? 50 : 100;
  const overallProgress = stage / (TOTAL_STAGES - 1);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        background: '#F4EFE6',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(26,107,107,${0.04 + overallProgress * 0.06}) 0%, transparent 65%)`,
          transition: 'background 0.6s ease',
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Top progress bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'rgba(26,107,107,0.1)' }}
      >
        <div
          style={{
            height: '100%',
            width: `${overallProgress * 100}%`,
            background: 'rgba(26,107,107,0.45)',
            transition: 'width 0.08s linear',
          }}
        />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6">

        {/* ── STAGE 0: Intro — Why Healing Stalls ── */}
        <div
          className="absolute flex flex-col items-center text-center"
          style={{
            width: 'min(90vw, 640px)',
            opacity: stage === 0 ? 1 : 0,
            transform: stage === 0 ? 'translateY(0) scale(1)' : 'translateY(-16px) scale(0.98)',
            transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: stage === 0 ? 'auto' : 'none',
          }}
        >
          <p
            className="font-sans uppercase mb-8 tracking-widest"
            style={{
              fontSize: 'clamp(0.55rem, 0.8vw, 0.65rem)',
              color: 'rgba(26,107,107,0.65)',
              letterSpacing: '0.3em',
            }}
          >
            Why healing stalls
          </p>
          <h2
            className="font-serif text-balance"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
              color: 'rgba(36,44,44,0.88)',
              lineHeight: 1.0,
              maxWidth: '14ch',
            }}
          >
            Most people are not unwell.
          </h2>
          <h2
            className="font-serif text-balance mt-1"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
              color: 'rgba(36,44,44,0.22)',
              lineHeight: 1.0,
              maxWidth: '14ch',
            }}
          >
            They are blocked.
          </h2>
          <p
            className="font-sans font-light leading-relaxed mt-8 mx-auto"
            style={{
              fontSize: 'clamp(0.82rem, 1.1vw, 0.94rem)',
              color: 'rgba(36,44,44,0.42)',
              maxWidth: '44ch',
            }}
          >
            Healing stalls when we treat symptoms without addressing the three dimensions that hold the block.
          </p>
          <div className="flex flex-col items-center gap-2 mt-12" style={{ opacity: 0.45 }}>
            <span className="font-sans uppercase text-[0.55rem] tracking-[0.2em]" style={{ color: 'rgba(36,44,44,0.45)' }}>
              scroll to explore
            </span>
            <div
              style={{
                width: '1px',
                height: '2rem',
                background: 'linear-gradient(to bottom, rgba(26,107,107,0.4), transparent)',
              }}
            />
          </div>
        </div>

        {/* ── STAGES 1-3: Dimension content ── */}
        <div
          style={{
            opacity: stage >= 1 ? 1 : 0,
            transition: 'opacity 0.5s ease',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: stage >= 1 ? 'auto' : 'none',
          }}
        >
          <p
            className="font-sans uppercase mb-10 tracking-widest"
            style={{
              fontSize: 'clamp(0.55rem, 0.8vw, 0.65rem)',
              color: 'rgba(26,107,107,0.65)',
              letterSpacing: '0.3em',
            }}
          >
            The Three Dimensions of Healing
          </p>

          {/* Horizontal timeline */}
          <div
            className="relative flex items-center justify-between mb-14"
            style={{ width: 'min(88vw, 640px)', height: '52px' }}
          >
            <div
              className="absolute left-0 right-0"
              style={{ top: '26px', height: '1px', background: 'rgba(26,107,107,0.15)' }}
            />
            <div
              className="absolute left-0"
              style={{
                top: '26px',
                height: '1px',
                width: `${timelineFillPercent}%`,
                background: 'rgba(26,107,107,0.5)',
                transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)',
              }}
            />

            {dimensions.map((dim, i) => {
              const isActive = i === dimIndex;
              const isPast = i < dimIndex;
              const nodeSize = isActive ? 52 : 36;
              return (
                <div
                  key={dim.id}
                  className="relative flex flex-col items-center"
                  style={{ zIndex: 1, height: '100%' }}
                >
                  <span
                    className="font-serif absolute"
                    style={{
                      top: `calc(26px - ${nodeSize / 2}px - 1.8rem)`,
                      fontSize: 'clamp(0.65rem, 0.9vw, 0.75rem)',
                      color: isActive ? 'rgba(26,107,107,0.65)' : isPast ? 'rgba(26,107,107,0.3)' : 'rgba(26,107,107,0.12)',
                      letterSpacing: '0.06em',
                      transition: 'color 0.55s ease, top 0.55s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    {dim.id}
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      top: '26px',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: `${nodeSize}px`,
                      height: `${nodeSize}px`,
                      borderRadius: '50%',
                      border: `1px solid ${isActive ? 'rgba(26,107,107,0.5)' : isPast ? 'rgba(26,107,107,0.25)' : 'rgba(26,107,107,0.12)'}`,
                      background: isActive ? 'rgba(26,107,107,0.08)' : isPast ? 'rgba(26,107,107,0.04)' : 'rgba(237,232,223,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.55s cubic-bezier(0.4,0,0.2,1)',
                      boxShadow: isActive ? '0 0 20px rgba(26,107,107,0.12)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: isActive ? '8px' : isPast ? '5px' : '4px',
                        height: isActive ? '8px' : isPast ? '5px' : '4px',
                        borderRadius: '50%',
                        background: isActive ? 'rgba(26,107,107,0.9)' : isPast ? 'rgba(26,107,107,0.45)' : 'rgba(26,107,107,0.2)',
                        transition: 'all 0.55s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    />
                  </div>
                  <span
                    className="font-sans uppercase absolute"
                    style={{
                      top: `calc(26px + ${nodeSize / 2}px + 0.5rem)`,
                      fontSize: 'clamp(0.55rem, 0.75vw, 0.62rem)',
                      letterSpacing: '0.22em',
                      color: isActive ? 'rgba(26,107,107,0.85)' : isPast ? 'rgba(36,44,44,0.3)' : 'rgba(36,44,44,0.15)',
                      transition: 'color 0.55s ease, top 0.55s cubic-bezier(0.4,0,0.2,1)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {dim.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Content cards */}
          <div
            className="relative w-full flex justify-center"
            style={{ minHeight: 'clamp(14rem, 22vw, 18rem)' }}
          >
            {dimensions.map((dim, i) => (
              <div
                key={dim.id}
                className="absolute flex flex-col items-center text-center"
                style={{
                  width: 'min(90vw, 560px)',
                  opacity: dimIndex === i ? 1 : 0,
                  transform: dimIndex === i
                    ? 'translateY(0) scale(1)'
                    : dimIndex > i
                    ? 'translateY(-12px) scale(0.98)'
                    : 'translateY(16px) scale(0.98)',
                  transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)',
                  pointerEvents: dimIndex === i ? 'auto' : 'none',
                }}
              >
                <div style={{ width: 'clamp(40px, 5vw, 56px)', height: 'clamp(40px, 5vw, 56px)', marginBottom: '1.5rem', opacity: 0.85 }}>
                  {dim.icon}
                </div>
                <p
                  className="font-serif mb-4"
                  style={{
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                    color: 'rgba(26,107,107,0.7)',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}
                >
                  {dim.label}
                </p>
                <h2
                  className="font-serif text-balance mb-6"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    color: 'rgba(36,44,44,0.88)',
                    lineHeight: 1.1,
                  }}
                >
                  {dim.headline}
                </h2>
                <p
                  className="font-sans font-light leading-relaxed mx-auto"
                  style={{
                    fontSize: 'clamp(0.82rem, 1.1vw, 0.94rem)',
                    color: 'rgba(36,44,44,0.42)',
                    maxWidth: '44ch',
                  }}
                >
                  {dim.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stage counter dots */}
        <div
          className="absolute bottom-8 left-1/2 flex gap-2"
          style={{ transform: 'translateX(-50%)' }}
        >
          {Array.from({ length: TOTAL_STAGES }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === stage ? '20px' : '5px',
                height: '5px',
                borderRadius: '3px',
                background: i === stage ? 'rgba(26,107,107,0.65)' : i < stage ? 'rgba(26,107,107,0.3)' : 'rgba(26,107,107,0.12)',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

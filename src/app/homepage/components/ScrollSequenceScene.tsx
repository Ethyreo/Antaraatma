'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';

const zones = [
  {
    phase: '01',
    label: 'Awareness',
    headline: 'The body speaks before the mind listens.',
    body: 'Every symptom is a signal. Every pattern has a root. Naturopathy begins where conventional medicine stops — at the origin.',
  },
  {
    phase: '02',
    label: 'Understanding',
    headline: 'Healing is not suppression. It is resolution.',
    body: 'When you understand what your body is communicating, the path forward becomes clear — not complicated.',
  },
  {
    phase: '03',
    label: 'Transformation',
    headline: 'Lasting change happens in layers.',
    body: 'Physical. Emotional. Energetic. Each dimension must be addressed for transformation to hold.',
  },
];

const TOTAL_STAGES = zones.length;
const STAGE_THRESHOLD = 300;

export default function ScrollSequenceScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeZone, setActiveZone] = useState(0);
  const [progress, setProgress] = useState(0);
  const [locked, setLocked] = useState(false);

  const accDelta = useRef(0);
  const lockedRef = useRef(false);
  const activeZoneRef = useRef(0);
  // Track whether we've exited forward (completed all stages)
  const completedRef = useRef(false);

  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => { activeZoneRef.current = activeZone; }, [activeZone]);

  const computeProgress = useCallback((zone: number, delta: number) => {
    const stageProgress = Math.min(1, Math.max(0, delta / STAGE_THRESHOLD));
    return (zone + stageProgress) / TOTAL_STAGES;
  }, []);

  const enterLock = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    sectionRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
  }, []);

  const exitLock = useCallback((direction: 'forward' | 'backward') => {
    lockedRef.current = false;
    setLocked(false);
    accDelta.current = 0;
    if (direction === 'forward') {
      completedRef.current = true;
    }
  }, []);

  // IntersectionObserver — re-lock whenever section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Always re-lock when entering, reset completed state
          completedRef.current = false;
          accDelta.current = 0;
          enterLock();
        } else if (!entry.isIntersecting) {
          if (lockedRef.current) exitLock('backward');
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [enterLock, exitLock]);

  // Wheel handler — attached to WINDOW when locked to capture all scroll events
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      const currentZone = activeZoneRef.current;

      if (delta > 0) {
        accDelta.current += delta;
        if (accDelta.current >= STAGE_THRESHOLD) {
          accDelta.current = 0;
          if (currentZone < TOTAL_STAGES - 1) {
            const next = currentZone + 1;
            setActiveZone(next);
            setProgress(computeProgress(next, 0));
          } else {
            setProgress(1);
            exitLock('forward');
          }
        } else {
          setProgress(computeProgress(currentZone, accDelta.current));
        }
      } else if (delta < 0) {
        accDelta.current += delta;
        if (accDelta.current <= -STAGE_THRESHOLD) {
          accDelta.current = 0;
          if (currentZone > 0) {
            const prev = currentZone - 1;
            setActiveZone(prev);
            setProgress(computeProgress(prev, 0));
          } else {
            exitLock('backward');
          }
        } else {
          const clampedDelta = Math.max(0, accDelta.current);
          setProgress(computeProgress(currentZone, clampedDelta));
        }
      }
    },
    [computeProgress, exitLock]
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

      const currentZone = activeZoneRef.current;
      if (dy > 0) {
        accDelta.current += dy * 3;
        if (accDelta.current >= STAGE_THRESHOLD) {
          accDelta.current = 0;
          if (currentZone < TOTAL_STAGES - 1) {
            const next = currentZone + 1;
            setActiveZone(next);
            setProgress(computeProgress(next, 0));
          } else {
            setProgress(1);
            exitLock('forward');
          }
        } else {
          setProgress(computeProgress(currentZone, accDelta.current));
        }
      } else if (dy < 0) {
        accDelta.current += dy * 3;
        if (accDelta.current <= -STAGE_THRESHOLD) {
          accDelta.current = 0;
          if (currentZone > 0) {
            const prev = currentZone - 1;
            setActiveZone(prev);
            setProgress(computeProgress(prev, 0));
          } else {
            exitLock('backward');
          }
        } else {
          const clampedDelta = Math.max(0, accDelta.current);
          setProgress(computeProgress(currentZone, clampedDelta));
        }
      }
    },
    [computeProgress, exitLock]
  );

  // Attach wheel/touch to WINDOW when locked — this ensures we capture all scroll
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

  // Lock body scroll when locked
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
      {/* Ambient orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% ${45 + progress * 10}%, rgba(26,107,107,${0.06 + progress * 0.07}) 0%, transparent 65%)`,
          transition: 'background 0.4s ease',
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

      {/* Progress line — left edge */}
      <div
        className="absolute left-0 top-0 w-px pointer-events-none"
        style={{ height: '100%', background: 'rgba(26,107,107,0.1)' }}
      >
        <div
          style={{
            width: '100%',
            height: `${progress * 100}%`,
            background: 'rgba(26,107,107,0.4)',
            transition: 'height 0.08s linear',
          }}
        />
      </div>

      {/* Main layout — vertically centered */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6">

        {/* ── Step progress display ── */}
        <div
          className="relative mb-10 flex-shrink-0 flex flex-col items-center"
          style={{ width: 'clamp(260px, 36vw, 420px)' }}
        >
          {/* Stage number + label */}
          <div className="flex flex-col items-center mb-6">
            <span
              className="font-serif"
              style={{
                fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
                color: 'rgba(36,44,44,0.75)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {String(activeZone + 1).padStart(2, '0')}
            </span>
            <span
              className="font-sans uppercase mt-2"
              style={{
                fontSize: '0.6rem',
                color: 'rgba(26,107,107,0.7)',
                letterSpacing: '0.22em',
              }}
            >
              of 03
            </span>
          </div>

          {/* Linear progress track */}
          <div className="w-full flex flex-col gap-3">
            {/* Track bar */}
            <div
              style={{
                width: '100%',
                height: '2px',
                background: 'rgba(26,107,107,0.15)',
                borderRadius: '2px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${progress * 100}%`,
                  background: 'rgba(26,107,107,0.6)',
                  borderRadius: '2px',
                  transition: 'width 0.12s linear',
                }}
              />
              {/* Step dots on track */}
              {[0, 1, 2].map((i) => {
                const isPast = i < activeZone;
                const isActive = i === activeZone;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${(i / 2) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: isActive ? '8px' : '6px',
                      height: isActive ? '8px' : '6px',
                      borderRadius: '50%',
                      background: isActive
                        ? 'rgba(26,107,107,0.95)'
                        : isPast
                        ? 'rgba(26,107,107,0.55)'
                        : 'rgba(26,107,107,0.2)',
                      border: isActive ? '1.5px solid rgba(26,107,107,0.4)' : 'none',
                      transition: 'background 0.4s ease, width 0.3s ease, height 0.3s ease',
                    }}
                  />
                );
              })}
            </div>

            {/* Stage labels under track */}
            <div className="flex justify-between w-full">
              {zones.map((zone, i) => {
                const isPast = i < activeZone;
                const isActive = i === activeZone;
                return (
                  <span
                    key={zone.phase}
                    className="font-sans uppercase"
                    style={{
                      fontSize: '0.52rem',
                      letterSpacing: '0.18em',
                      color: isActive
                        ? 'rgba(26,107,107,0.85)'
                        : isPast
                        ? 'rgba(36,44,44,0.35)'
                        : 'rgba(36,44,44,0.18)',
                      transition: 'color 0.4s ease',
                      textAlign: i === 0 ? 'left' : i === 2 ? 'right' : 'center',
                      flex: 1,
                    }}
                  >
                    {zone.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Zone content — centered, constrained */}
        <div
          className="relative w-full flex justify-center"
          style={{ minHeight: 'clamp(11rem, 20vw, 15rem)' }}
        >
          {zones?.map((zone, i) => (
            <div
              key={zone?.phase}
              className="absolute text-center"
              style={{
                width: 'min(90vw, 560px)',
                opacity: activeZone === i ? 1 : 0,
                transform: activeZone === i
                  ? 'translateY(0)'
                  : activeZone > i
                  ? 'translateY(-10px)'
                  : 'translateY(14px)',
                transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: activeZone === i ? 'auto' : 'none',
              }}
            >
              <p
                className="font-serif mb-4"
                style={{
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.7rem)',
                  color: 'rgba(26,107,107,0.7)',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                }}
              >
                {zone?.label}
              </p>
              <h2
                className="font-serif text-balance mb-6"
                style={{
                  fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
                  color: 'rgba(36,44,44,0.88)',
                  lineHeight: 1.08,
                }}
              >
                {zone?.headline}
              </h2>
              <p
                className="font-sans font-light leading-relaxed mx-auto"
                style={{
                  fontSize: 'clamp(0.82rem, 1.1vw, 0.94rem)',
                  color: 'rgba(36,44,44,0.45)',
                  maxWidth: '42ch',
                }}
              >
                {zone?.body}
              </p>
            </div>
          ))}
        </div>

        {/* Stage indicators — bottom */}
        <div
          className="absolute bottom-10 left-0 right-0 flex items-end justify-center"
          style={{ gap: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          {zones?.map((zone, i) => {
            const isActive = i === activeZone;
            const isPast = i < activeZone;
            return (
              <div key={zone?.phase} className="flex flex-col items-center gap-2">
                <div
                  style={{
                    width: isActive ? '2rem' : '1rem',
                    height: '1px',
                    background: isActive
                      ? 'rgba(26,107,107,0.7)'
                      : isPast
                      ? 'rgba(26,107,107,0.3)'
                      : 'rgba(36,44,44,0.12)',
                    transition: 'width 0.4s ease, background 0.4s ease',
                  }}
                />
                <span
                  className="font-sans uppercase"
                  style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.18em',
                    color: isActive
                      ? 'rgba(26,107,107,0.8)'
                      : isPast
                      ? 'rgba(36,44,44,0.3)'
                      : 'rgba(36,44,44,0.15)',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {zone?.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Scroll hint — shown only at start */}
        <div
          className="absolute bottom-10 right-8 flex flex-col items-center gap-1"
          style={{
            opacity: progress < 0.05 ? 0.4 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          <span className="font-sans uppercase text-[0.55rem] tracking-[0.2em]" style={{ color: 'rgba(36,44,44,0.45)' }}>
            scroll
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
    </div>
  );
}

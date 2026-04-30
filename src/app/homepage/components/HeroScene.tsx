'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animFrameRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = useRef(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.src = '/assets/images/Blue_White_Modern_Buy_1_Get_1_Promotion_Instagram_Post-1775409089496.png';
    img.onload = () => {
      imgRef.current = img;
      imgLoadedRef.current = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const RADIUS = 90;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) { animFrameRef.current = requestAnimationFrame(render); return; }

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const { x: mx, y: my } = mouseRef.current;
      const isHovering = mx > 0 && my > 0;

      if (imgLoadedRef.current && imgRef.current && isHovering) {
        const img = imgRef.current;
        const maxW = W * 0.85;
        const maxH = H * 0.85;
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const drawX = (W - drawW) / 2;
        const drawY = (H - drawH) / 2;

        ctx.fillStyle = 'rgba(26,40,40,0.85)';
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, RADIUS, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.fillStyle = 'rgba(26,40,40,0.18)';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        const grad = ctx.createRadialGradient(mx, my, RADIUS * 0.72, mx, my, RADIUS);
        grad.addColorStop(0, 'rgba(26,40,40,0)');
        grad.addColorStop(1, 'rgba(26,40,40,0.92)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, RADIUS, 0, Math.PI * 2);
        ctx.fill();

        const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, RADIUS * 0.9);
        glowGrad.addColorStop(0, 'rgba(26,107,107,0.1)');
        glowGrad.addColorStop(1, 'rgba(26,107,107,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mx, my, RADIUS * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      containerRef.current.style.setProperty('--mx', `${x * 100}%`);
      containerRef.current.style.setProperty('--my', `${y * 100}%`);
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => { mouseRef.current = { x: -999, y: -999 }; };
    const el = containerRef.current;
    el?.addEventListener('mousemove', handleMouseMove as EventListener);
    el?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el?.removeEventListener('mousemove', handleMouseMove as EventListener);
      el?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const parallaxOffset = scrollY * 0.18;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: '#1A2828',
        '--mx': '30%',
        '--my': '40%',
      } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/images/Blue_White_Modern_Buy_1_Get_1_Promotion_Instagram_Post-1775409089496.png"
        alt="Chakra meditation energy visualization"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        style={{
          opacity: 0.0,
          objectPosition: 'center center',
          transform: `translateY(${parallaxOffset * 0.4}px) translateZ(0)`,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Cursor-reactive ambient — teal glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse 55% 45% at var(--mx) var(--my), rgba(26,107,107,0.08) 0%, transparent 70%)',
          transition: 'background 0.15s ease',
        }}
      />

      {/* Static ambient layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 12% 18%, rgba(95,189,189,0.04) 0%, transparent 55%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 45% 65% at 88% 82%, rgba(58,122,90,0.03) 0%, transparent 55%)' }} />
      </div>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Sacred geometry watermark — concentric circles */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 2 }}>
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" opacity="0.04" aria-hidden="true">
          <circle cx="300" cy="300" r="60" stroke="#5FBDBD" strokeWidth="0.8"/>
          <circle cx="300" cy="300" r="120" stroke="#5FBDBD" strokeWidth="0.8"/>
          <circle cx="300" cy="300" r="180" stroke="#5FBDBD" strokeWidth="0.8"/>
          <circle cx="300" cy="300" r="240" stroke="#5FBDBD" strokeWidth="0.8"/>
          <circle cx="300" cy="300" r="290" stroke="#5FBDBD" strokeWidth="0.8"/>
          <line x1="300" y1="10" x2="300" y2="590" stroke="#5FBDBD" strokeWidth="0.5"/>
          <line x1="10" y1="300" x2="590" y2="300" stroke="#5FBDBD" strokeWidth="0.5"/>
          <circle cx="300" cy="300" r="4" fill="#C4A052" opacity="0.6"/>
        </svg>
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col flex-1 justify-center items-center text-center pt-32 pb-24 px-6"
        style={{
          zIndex: 10,
          transform: `translateY(${-parallaxOffset}px) translateZ(0)`,
          willChange: 'transform',
        }}
      >
        <div className="max-w-2xl w-full mx-auto">
          {/* Eyebrow */}
          <p
            className="font-sans uppercase tracking-[0.22em] mb-14"
            style={{
              fontSize: '0.62rem',
              color: 'rgba(95,189,189,0.5)',
              fontWeight: 600,
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
            }}
          >
            Naturopathy · Healing · Transformation
          </p>

          {/* Headline — Raleway light weight */}
          <h1
            className="font-serif leading-[1.0] mb-10 text-balance"
            style={{
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              color: '#F4EFE6',
              fontWeight: 200,
              letterSpacing: '0.06em',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 1s ease 0.28s, transform 1s ease 0.28s',
            }}
          >
            Enter stillness.<br />
            <span style={{ color: 'rgba(95,189,189,0.6)' }}>Begin healing.</span>
          </h1>

          {/* Subtext */}
          <p
            className="font-sans font-light leading-relaxed mb-20 mx-auto"
            style={{
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              color: 'rgba(244,239,230,0.35)',
              maxWidth: '38ch',
              fontWeight: 300,
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 1s ease 0.46s, transform 1s ease 0.46s',
            }}
          >
            You are not broken. You are becoming. Dr. Vijay Singla walks beside you — through a structured pathway grounded in naturopathy and your body&apos;s innate wisdom.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 1s ease 0.62s, transform 1s ease 0.62s',
            }}
          >
            <Link
              href="/awareness-session"
              className="inline-flex items-center gap-3 px-8 py-3.5 text-sm font-sans tracking-wide rounded-sm transition-all duration-300"
              style={{
                background: '#1A6B6B',
                color: '#F4EFE6',
                fontWeight: 600,
                letterSpacing: '0.06em',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#155858')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1A6B6B')}
            >
              Begin Your Journey
            </Link>
            <Link
              href="/programs-overview"
              className="inline-flex items-center gap-3 px-8 py-3.5 text-sm font-sans tracking-wide rounded-sm transition-all duration-300"
              style={{
                border: '1px solid rgba(95,189,189,0.3)',
                color: 'rgba(95,189,189,0.7)',
                fontWeight: 400,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(95,189,189,0.6)';
                (e.currentTarget as HTMLElement).style.color = '#5FBDBD';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(95,189,189,0.3)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(95,189,189,0.7)';
              }}
            >
              Explore Programs
            </Link>
          </div>

          {/* Stats */}
          <div
            className="mt-20 pt-8 grid grid-cols-3 gap-6"
            style={{
              borderTop: '1px solid rgba(168,216,206,0.1)',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 1s ease 0.8s',
            }}
          >
            {[
              { value: '2,400+', label: 'Students Healed' },
              { value: '94%', label: 'Completion Rate' },
              { value: '12 yrs', label: 'Clinical Practice' },
            ]?.map((stat) => (
              <div key={`hero-stat-${stat?.label}`} className="text-center">
                <p className="font-serif tabular-nums" style={{ fontSize: '1.5rem', color: 'rgba(244,239,230,0.7)', fontWeight: 300 }}>{stat?.value}</p>
                <p className="text-xs font-sans uppercase tracking-widest mt-1" style={{ color: 'rgba(168,216,206,0.3)', fontWeight: 600 }}>{stat?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-8 animate-pulse-soft" style={{ background: '#5FBDBD' }} />
        <span className="text-2xs font-sans tracking-[0.15em] uppercase" style={{ color: '#5FBDBD' }}>Scroll</span>
      </div>
    </section>
  );
}
